import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CreateTimeSlotRequest {
  showroomId: string;
  category: 'KITCHEN' | 'SANITARY' | 'FLOORING';
  startAt: string;
  endAt: string;
  capacity?: number;
}

interface RequestAppointmentRequest {
  timeSlotId: string;
  projectId: string;
  lotId: string;
  notesBuyer?: string;
}

interface RespondAppointmentRequest {
  status: 'CONFIRMED' | 'DECLINED';
  notesSupplier?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/appointments', '');
    const method = req.method;

    if (method === 'POST' && path === '/slots') {
      return await createTimeSlot(supabase, user.id, req);
    }

    if (method === 'GET' && path.startsWith('/showrooms/') && path.endsWith('/slots')) {
      const showroomId = path.split('/')[2];
      return await listTimeSlots(supabase, showroomId);
    }

    if (method === 'PATCH' && path.startsWith('/slots/')) {
      const slotId = path.split('/')[2];
      return await updateTimeSlot(supabase, user.id, slotId, req);
    }

    if (method === 'GET' && path === '/available') {
      const projectId = url.searchParams.get('projectId');
      const category = url.searchParams.get('category');
      if (!projectId || !category) {
        return jsonResponse({ error: 'projectId and category required' }, 400);
      }
      return await listAvailableSlots(supabase, projectId, category);
    }

    if (method === 'POST' && path === '/buyer/request') {
      return await requestAppointment(supabase, user.id, req);
    }

    if (method === 'GET' && path === '/buyer/me') {
      return await listBuyerAppointments(supabase, user.id);
    }

    if (method === 'GET' && path.startsWith('/showrooms/')) {
      const showroomId = path.split('/')[2];
      return await listShowroomAppointments(supabase, showroomId);
    }

    if (method === 'POST' && path.match(/\/appointments\/[^\/]+\/respond/)) {
      const appointmentId = path.split('/')[2];
      return await respondAppointment(supabase, user.id, appointmentId, req);
    }

    if (method === 'PATCH' && path.match(/\/appointments\/[^\/]+\/cancel/)) {
      const appointmentId = path.split('/')[2];
      return await cancelAppointment(supabase, user.id, appointmentId);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error: any) {
    console.error('Error in appointments function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createTimeSlot(supabase: any, userId: string, req: Request) {
  const body: CreateTimeSlotRequest = await req.json();

  const { data: showroom, error: showroomError } = await supabase
    .from('supplier_showrooms')
    .select('organization_id')
    .eq('id', body.showroomId)
    .single();

  if (showroomError || !showroom) {
    return jsonResponse({ error: 'Showroom not found' }, 404);
  }

  const { data: userOrg } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('organization_id', showroom.organization_id)
    .single();

  if (!userOrg) {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  const { data, error } = await supabase
    .from('supplier_time_slots')
    .insert({
      showroom_id: body.showroomId,
      category: body.category,
      start_at: body.startAt,
      end_at: body.endAt,
      capacity: body.capacity || 1,
    })
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function listTimeSlots(supabase: any, showroomId: string) {
  const { data, error } = await supabase
    .from('supplier_time_slots')
    .select('*')
    .eq('showroom_id', showroomId)
    .eq('is_active', true)
    .order('start_at', { ascending: true });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function updateTimeSlot(supabase: any, userId: string, slotId: string, req: Request) {
  const body = await req.json();

  const { data: slot, error: slotError } = await supabase
    .from('supplier_time_slots')
    .select('showroom_id, supplier_showrooms(organization_id)')
    .eq('id', slotId)
    .single();

  if (slotError || !slot) {
    return jsonResponse({ error: 'Time slot not found' }, 404);
  }

  const { data: userOrg } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('organization_id', slot.supplier_showrooms.organization_id)
    .single();

  if (!userOrg) {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  const updateData: any = {};
  if (body.startAt) updateData.start_at = body.startAt;
  if (body.endAt) updateData.end_at = body.endAt;
  if (body.capacity !== undefined) updateData.capacity = body.capacity;
  if (body.isActive !== undefined) updateData.is_active = body.isActive;

  const { data, error } = await supabase
    .from('supplier_time_slots')
    .update(updateData)
    .eq('id', slotId)
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function listAvailableSlots(supabase: any, projectId: string, category: string) {
  const now = new Date().toISOString();

  const { data: slots, error } = await supabase
    .from('supplier_time_slots')
    .select(`
      *,
      showroom:supplier_showrooms(id, name, city, contact_email, contact_phone),
      appointments:supplier_appointments(id, status)
    `)
    .eq('category', category)
    .eq('is_active', true)
    .gt('start_at', now)
    .order('start_at', { ascending: true });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const available = slots.filter((slot: any) => {
    const confirmed = slot.appointments.filter((a: any) => a.status === 'CONFIRMED').length;
    return confirmed < slot.capacity;
  });

  return jsonResponse(available);
}

async function requestAppointment(supabase: any, buyerId: string, req: Request) {
  const body: RequestAppointmentRequest = await req.json();

  const { data: slot } = await supabase
    .from('supplier_time_slots')
    .select('*, showroom:supplier_showrooms(*)')
    .eq('id', body.timeSlotId)
    .single();

  if (!slot) {
    return jsonResponse({ error: 'Time slot not found' }, 404);
  }

  const remainingCapacity = await supabase.rpc('get_time_slot_remaining_capacity', {
    p_time_slot_id: body.timeSlotId,
  });

  if (remainingCapacity.data <= 0) {
    return jsonResponse({ error: 'Time slot is full' }, 400);
  }

  const { data: lot } = await supabase
    .from('lots')
    .select('id, lot_number, project_id, projects(name)')
    .eq('id', body.lotId)
    .eq('project_id', body.projectId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Lot not found' }, 404);
  }

  const { data: appointment, error } = await supabase
    .from('supplier_appointments')
    .insert({
      showroom_id: slot.showroom_id,
      time_slot_id: body.timeSlotId,
      project_id: body.projectId,
      lot_id: body.lotId,
      buyer_id: buyerId,
      notes_buyer: body.notesBuyer || null,
    })
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const { data: supplierUsers } = await supabase
    .from('user_organizations')
    .select('user_id')
    .eq('organization_id', slot.showroom.organization_id);

  for (const su of supplierUsers || []) {
    await supabase.from('notifications').insert({
      user_id: su.user_id,
      type: 'APPOINTMENT_REQUEST',
      i18n_key: 'notifications.appointment.newRequest',
      i18n_params: {
        category: slot.category,
        lotNumber: lot.lot_number,
        projectName: lot.projects.name,
      },
      title: `Nouvelle demande de rendez-vous – ${slot.category}`,
      body: `Un acquéreur a demandé un rendez-vous pour le lot ${lot.lot_number}.`,
      project_id: body.projectId,
      link_url: `/suppliers/showrooms/${slot.showroom_id}/appointments`,
    });
  }

  return jsonResponse(appointment);
}

async function respondAppointment(supabase: any, userId: string, appointmentId: string, req: Request) {
  const body: RespondAppointmentRequest = await req.json();

  const { data: appointment } = await supabase
    .from('supplier_appointments')
    .select(`
      *,
      showroom:supplier_showrooms(organization_id, name),
      time_slot:supplier_time_slots(start_at, category),
      lot:lots(lot_number),
      project:projects(name)
    `)
    .eq('id', appointmentId)
    .single();

  if (!appointment) {
    return jsonResponse({ error: 'Appointment not found' }, 404);
  }

  const { data: userOrg } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('organization_id', appointment.showroom.organization_id)
    .single();

  if (!userOrg) {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  const updateData: any = {
    status: body.status,
    notes_supplier: body.notesSupplier || null,
  };

  if (body.status === 'CONFIRMED') {
    updateData.confirmed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('supplier_appointments')
    .update(updateData)
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const notifKey = body.status === 'CONFIRMED'
    ? 'notifications.appointment.confirmed'
    : 'notifications.appointment.declined';

  await supabase.from('notifications').insert({
    user_id: appointment.buyer_id,
    type: 'APPOINTMENT_RESPONSE',
    i18n_key: notifKey,
    i18n_params: {
      showroomName: appointment.showroom.name,
      category: appointment.time_slot.category,
    },
    title: body.status === 'CONFIRMED'
      ? 'Votre rendez-vous fournisseur est confirmé'
      : 'Votre rendez-vous fournisseur a été refusé',
    body: `Showroom: ${appointment.showroom.name}, le ${new Date(appointment.time_slot.start_at).toLocaleString('fr-CH')}.`,
    project_id: appointment.project_id,
    link_url: '/buyer/appointments',
  });

  return jsonResponse(data);
}

async function cancelAppointment(supabase: any, buyerId: string, appointmentId: string) {
  const { data: appointment } = await supabase
    .from('supplier_appointments')
    .select('buyer_id')
    .eq('id', appointmentId)
    .single();

  if (!appointment || appointment.buyer_id !== buyerId) {
    return jsonResponse({ error: 'Appointment not found or unauthorized' }, 404);
  }

  const { data, error } = await supabase
    .from('supplier_appointments')
    .update({
      status: 'CANCELLED',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function listBuyerAppointments(supabase: any, buyerId: string) {
  const { data, error } = await supabase
    .from('supplier_appointments')
    .select(`
      *,
      showroom:supplier_showrooms(name, city, contact_email, contact_phone),
      time_slot:supplier_time_slots(start_at, end_at, category),
      lot:lots(lot_number),
      project:projects(name)
    `)
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function listShowroomAppointments(supabase: any, showroomId: string) {
  const { data, error } = await supabase
    .from('supplier_appointments')
    .select(`
      *,
      time_slot:supplier_time_slots(start_at, end_at, category),
      buyer:users(first_name, last_name, email, phone),
      lot:lots(lot_number),
      project:projects(name)
    `)
    .eq('showroom_id', showroomId)
    .order('time_slot.start_at', { ascending: true });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}
