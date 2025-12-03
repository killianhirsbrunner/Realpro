import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const method = req.method;
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots') {
      const projectId = pathSegments[1];
      const body = await req.json().catch(() => ({}));
      const lots = await listLotsForBroker(supabase, projectId, body.userId);
      return jsonResponse(lots);
    }

    if (method === 'PATCH' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots' && pathSegments[4] === 'status') {
      const projectId = pathSegments[1];
      const lotId = pathSegments[3];
      const body = await req.json();
      const result = await updateLotStatus(supabase, projectId, lotId, body);
      return jsonResponse(result);
    }

    if (method === 'PATCH' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots' && pathSegments[4] === 'signatures') {
      const projectId = pathSegments[1];
      const lotId = pathSegments[3];
      const body = await req.json();
      const result = await updateLotSignatures(supabase, projectId, lotId, body);
      return jsonResponse(result);
    }

    if (method === 'POST' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots' && pathSegments[4] === 'sales-contract') {
      const projectId = pathSegments[1];
      const lotId = pathSegments[3];
      const body = await req.json();
      const result = await attachSalesContract(supabase, projectId, lotId, body);
      return jsonResponse(result);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'sales-contracts') {
      const projectId = pathSegments[1];
      const body = await req.json().catch(() => ({}));
      const contracts = await listSalesContracts(supabase, projectId, body.userId);
      return jsonResponse(contracts);
    }

    if (method === 'GET' && pathSegments[0] === 'sales-contracts' && pathSegments[1]) {
      const contractId = pathSegments[1];
      const contract = await getSalesContractDetail(supabase, contractId);
      return jsonResponse(contract);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots' && pathSegments[4] === 'deal') {
      const projectId = pathSegments[1];
      const lotId = pathSegments[3];
      const body = await req.json().catch(() => ({}));
      const deal = await getLotDealDetails(supabase, projectId, lotId, body.userId);
      return jsonResponse(deal);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in broker function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function ensureBrokerAccess(supabase: any, userId: string, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, organization_id')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const { data: userOrg, error: userOrgError } = await supabase
    .from('user_organizations')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', project.organization_id)
    .maybeSingle();

  if (userOrgError) throw userOrgError;
  if (!userOrg || userOrg.role !== 'BROKER') {
    throw new Error('Droits courtier requis pour cette action');
  }

  return project;
}

async function listLotsForBroker(supabase: any, projectId: string, userId: string) {
  await ensureBrokerAccess(supabase, userId, projectId);

  const { data: lots, error } = await supabase
    .from('lots')
    .select(`
      id,
      lot_number,
      rooms_label,
      surface_habitable,
      status,
      price_vat,
      price_qpt,
      building:buildings(id, name),
      floor:floors(id, label),
      buyer:buyers!lots_buyer_id_fkey(id, first_name, last_name, email)
    `)
    .eq('project_id', projectId)
    .order('building_id', { ascending: true })
    .order('lot_number', { ascending: true });

  if (error) throw error;

  return lots.map((lot: any) => ({
    id: lot.id,
    lotNumber: lot.lot_number,
    roomsLabel: lot.rooms_label,
    surfaceHabitable: lot.surface_habitable,
    status: lot.status,
    priceVat: lot.price_vat,
    priceQpt: lot.price_qpt,
    building: lot.building ? { id: lot.building.id, name: lot.building.name } : null,
    floor: lot.floor ? { id: lot.floor.id, label: lot.floor.label } : null,
    buyer: lot.buyer ? {
      id: lot.buyer.id,
      firstName: lot.buyer.first_name,
      lastName: lot.buyer.last_name,
      email: lot.buyer.email,
    } : null,
  }));
}

async function updateLotStatus(supabase: any, projectId: string, lotId: string, body: any) {
  await ensureBrokerAccess(supabase, body.userId, projectId);

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== projectId) {
    throw new Error('Lot introuvable dans ce projet');
  }

  const { data: updated, error: updateError } = await supabase
    .from('lots')
    .update({ status: body.status })
    .eq('id', lotId)
    .select()
    .single();

  if (updateError) throw updateError;

  await supabase.from('audit_logs').insert({
    organization_id: (await supabase.from('projects').select('organization_id').eq('id', projectId).single()).data.organization_id,
    project_id: projectId,
    user_id: body.userId,
    action: 'BROKER_LOT_STATUS_UPDATED',
    entity_type: 'LOT',
    entity_id: lotId,
    metadata: { status: body.status },
  });

  return updated;
}

async function updateLotSignatures(supabase: any, projectId: string, lotId: string, body: any) {
  await ensureBrokerAccess(supabase, body.userId, projectId);

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== projectId) {
    throw new Error('Lot introuvable dans ce projet');
  }

  const { data: salesContract, error: scError } = await supabase
    .from('sales_contracts')
    .select('id, signed_at, effective_at')
    .eq('lot_id', lotId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (scError) throw scError;
  if (!salesContract) {
    throw new Error('Aucun contrat de vente lié à ce lot');
  }

  const updateData: any = {};
  if (body.actSignedAt) {
    updateData.signed_at = body.actSignedAt;
  }
  if (body.reservationSignedAt) {
    updateData.effective_at = body.reservationSignedAt;
  }

  const { data: updated, error: updateError } = await supabase
    .from('sales_contracts')
    .update(updateData)
    .eq('id', salesContract.id)
    .select()
    .single();

  if (updateError) throw updateError;

  await supabase.from('audit_logs').insert({
    organization_id: (await supabase.from('projects').select('organization_id').eq('id', projectId).single()).data.organization_id,
    project_id: projectId,
    user_id: body.userId,
    action: 'BROKER_LOT_SIGNATURES_UPDATED',
    entity_type: 'SALES_CONTRACT',
    entity_id: salesContract.id,
    metadata: {
      reservationSignedAt: body.reservationSignedAt || null,
      actSignedAt: body.actSignedAt || null,
    },
  });

  return updated;
}

async function attachSalesContract(supabase: any, projectId: string, lotId: string, body: any) {
  await ensureBrokerAccess(supabase, body.userId, projectId);

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== projectId) {
    throw new Error('Lot introuvable dans ce projet');
  }

  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select('id, project_id')
    .eq('id', body.buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyer || buyer.project_id !== projectId) {
    throw new Error('Acheteur introuvable dans ce projet');
  }

  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('id')
    .eq('id', body.salesDocumentId)
    .maybeSingle();

  if (docError) throw docError;
  if (!document) {
    throw new Error('Document introuvable');
  }

  let { data: buyerFile } = await supabase
    .from('buyer_files')
    .select('id')
    .eq('buyer_id', buyer.id)
    .eq('project_id', projectId)
    .maybeSingle();

  if (!buyerFile) {
    const { data: newFile, error: fileError } = await supabase
      .from('buyer_files')
      .insert({
        project_id: projectId,
        buyer_id: buyer.id,
        status: 'READY_FOR_NOTARY',
      })
      .select()
      .single();

    if (fileError) throw fileError;
    buyerFile = newFile;
  }

  const { data: salesContract, error: scError } = await supabase
    .from('sales_contracts')
    .insert({
      project_id: projectId,
      lot_id: lotId,
      buyer_id: buyer.id,
      buyer_file_id: buyerFile.id,
      document_id: body.salesDocumentId,
      signed_at: body.actSignedAt || null,
      effective_at: null,
      created_by_id: body.userId,
    })
    .select()
    .single();

  if (scError) throw scError;

  await supabase
    .from('lots')
    .update({ status: 'SOLD', buyer_id: buyer.id })
    .eq('id', lotId);

  await supabase.from('audit_logs').insert({
    organization_id: (await supabase.from('projects').select('organization_id').eq('id', projectId).single()).data.organization_id,
    project_id: projectId,
    user_id: body.userId,
    action: 'BROKER_SALES_CONTRACT_ATTACHED',
    entity_type: 'SALES_CONTRACT',
    entity_id: salesContract.id,
    metadata: {
      lotId,
      buyerId: buyer.id,
      documentId: body.salesDocumentId,
    },
  });

  return salesContract;
}

async function listSalesContracts(supabase: any, projectId: string, userId: string) {
  await ensureBrokerAccess(supabase, userId, projectId);

  const { data: contracts, error } = await supabase
    .from('sales_contracts')
    .select(`
      id,
      signed_at,
      effective_at,
      created_at,
      lot:lots(id, lot_number, rooms_label),
      buyer:buyers(id, first_name, last_name, email),
      buyer_file:buyer_files(id, status)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return contracts.map((c: any) => ({
    id: c.id,
    signedAt: c.signed_at,
    effectiveAt: c.effective_at,
    createdAt: c.created_at,
    lot: c.lot ? {
      id: c.lot.id,
      lotNumber: c.lot.lot_number,
      roomsLabel: c.lot.rooms_label,
    } : null,
    buyer: c.buyer ? {
      id: c.buyer.id,
      firstName: c.buyer.first_name,
      lastName: c.buyer.last_name,
      email: c.buyer.email,
    } : null,
    buyerFileStatus: c.buyer_file?.status || null,
  }));
}

async function getSalesContractDetail(supabase: any, contractId: string) {
  const { data: contract, error } = await supabase
    .from('sales_contracts')
    .select(`
      id,
      signed_at,
      effective_at,
      created_at,
      project:projects(id, name),
      lot:lots(id, lot_number, rooms_label, surface_habitable, price_vat, price_qpt, building:buildings(name)),
      buyer:buyers(id, first_name, last_name, email, phone, address_street, address_city, address_postal_code),
      buyer_file:buyer_files(id, status, notary_name, notary_contact),
      document:documents(id, filename, file_path, file_size, mime_type)
    `)
    .eq('id', contractId)
    .maybeSingle();

  if (error) throw error;
  if (!contract) throw new Error('Contrat de vente introuvable');

  return {
    id: contract.id,
    signedAt: contract.signed_at,
    effectiveAt: contract.effective_at,
    createdAt: contract.created_at,
    project: contract.project,
    lot: contract.lot ? {
      id: contract.lot.id,
      lotNumber: contract.lot.lot_number,
      roomsLabel: contract.lot.rooms_label,
      surfaceHabitable: contract.lot.surface_habitable,
      priceVat: contract.lot.price_vat,
      priceQpt: contract.lot.price_qpt,
      building: contract.lot.building,
    } : null,
    buyer: contract.buyer ? {
      id: contract.buyer.id,
      firstName: contract.buyer.first_name,
      lastName: contract.buyer.last_name,
      email: contract.buyer.email,
      phone: contract.buyer.phone,
      addressStreet: contract.buyer.address_street,
      addressCity: contract.buyer.address_city,
      addressPostalCode: contract.buyer.address_postal_code,
    } : null,
    buyerFile: contract.buyer_file ? {
      id: contract.buyer_file.id,
      status: contract.buyer_file.status,
      notaryName: contract.buyer_file.notary_name,
      notaryContact: contract.buyer_file.notary_contact,
    } : null,
    document: contract.document,
  };
}

async function getLotDealDetails(supabase: any, projectId: string, lotId: string, userId: string) {
  await ensureBrokerAccess(supabase, userId, projectId);

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select(`
      id,
      lot_number,
      rooms_label,
      surface_habitable,
      status,
      price_vat,
      price_qpt,
      buyer_id,
      building:buildings(id, name),
      floor:floors(id, label),
      buyer:buyers!lots_buyer_id_fkey(id, first_name, last_name, email, phone)
    `)
    .eq('id', lotId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot) throw new Error('Lot introuvable dans ce projet');

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, start_date, end_date, signed_at, status')
    .eq('lot_id', lotId)
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: salesContract } = await supabase
    .from('sales_contracts')
    .select(`
      id,
      signed_at,
      effective_at,
      document:documents(id, filename, file_path, file_size, mime_type)
    `)
    .eq('lot_id', lotId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let buyerFile = null;
  let notaryFile = null;

  if (lot.buyer_id) {
    const { data: bfData } = await supabase
      .from('buyer_files')
      .select('id, status, notary_name, notary_contact')
      .eq('buyer_id', lot.buyer_id)
      .eq('project_id', projectId)
      .maybeSingle();

    buyerFile = bfData;
  }

  if (salesContract) {
    const { data: nfData } = await supabase
      .from('notary_files')
      .select(`
        id,
        status,
        notary_name,
        notary_contact
      `)
      .eq('sales_contract_id', salesContract.id)
      .maybeSingle();

    if (nfData) {
      const { data: acts } = await supabase
        .from('notary_acts')
        .select(`
          id,
          act_type,
          created_at,
          document:documents(id, filename, file_path)
        `)
        .eq('notary_file_id', nfData.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: appointments } = await supabase
        .from('notary_appointments')
        .select('id, date, location, notes')
        .eq('notary_file_id', nfData.id)
        .order('date', { ascending: false })
        .limit(1);

      notaryFile = {
        ...nfData,
        lastAct: acts && acts.length > 0 ? acts[0] : null,
        lastAppointment: appointments && appointments.length > 0 ? appointments[0] : null,
      };
    }
  }

  return {
    lot: {
      id: lot.id,
      lotNumber: lot.lot_number,
      roomsLabel: lot.rooms_label,
      surfaceHabitable: lot.surface_habitable,
      status: lot.status,
      building: lot.building?.name || null,
      floor: lot.floor?.label || null,
      priceVat: lot.price_vat,
      priceQpt: lot.price_qpt,
    },
    buyer: lot.buyer ? {
      id: lot.buyer.id,
      firstName: lot.buyer.first_name,
      lastName: lot.buyer.last_name,
      email: lot.buyer.email,
      phone: lot.buyer.phone,
    } : null,
    reservation: reservation ? {
      id: reservation.id,
      startDate: reservation.start_date,
      endDate: reservation.end_date,
      signedAt: reservation.signed_at,
      status: reservation.status,
    } : null,
    salesContract: salesContract ? {
      id: salesContract.id,
      signedAt: salesContract.signed_at,
      effectiveAt: salesContract.effective_at,
      document: salesContract.document ? {
        id: salesContract.document.id,
        name: salesContract.document.filename,
        downloadUrl: `/documents/${salesContract.document.id}/download`,
      } : null,
      notary: notaryFile ? {
        status: notaryFile.status,
        notaryName: notaryFile.notary_name,
        notaryContact: notaryFile.notary_contact,
        lastAct: notaryFile.lastAct ? {
          id: notaryFile.lastAct.document.id,
          name: notaryFile.lastAct.document.filename,
          downloadUrl: `/documents/${notaryFile.lastAct.document.id}/download`,
        } : null,
        lastAppointment: notaryFile.lastAppointment || null,
      } : null,
    } : null,
    buyerFile: buyerFile ? {
      id: buyerFile.id,
      status: buyerFile.status,
      notaryName: buyerFile.notary_name,
      notaryContact: buyerFile.notary_contact,
    } : null,
  };
}
