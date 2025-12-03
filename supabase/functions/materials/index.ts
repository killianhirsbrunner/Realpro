import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'catalog') {
      const projectId = pathSegments[1];
      const body = await req.json().catch(() => ({}));
      const catalog = await getProjectCatalog(supabase, projectId, body.organizationId);
      return jsonResponse(catalog);
    }

    if (method === 'POST' && pathSegments[0] === 'projects' && pathSegments[2] === 'categories') {
      const projectId = pathSegments[1];
      const body = await req.json();
      const category = await createCategory(supabase, projectId, body);
      return jsonResponse(category);
    }

    if (method === 'PATCH' && pathSegments[0] === 'categories' && pathSegments[1]) {
      const categoryId = pathSegments[1];
      const body = await req.json();
      const category = await updateCategory(supabase, categoryId, body);
      return jsonResponse(category);
    }

    if (method === 'POST' && pathSegments[0] === 'options') {
      const body = await req.json();
      const option = await createOption(supabase, body);
      return jsonResponse(option);
    }

    if (method === 'PATCH' && pathSegments[0] === 'options' && pathSegments[1]) {
      const optionId = pathSegments[1];
      const body = await req.json();
      const option = await updateOption(supabase, optionId, body);
      return jsonResponse(option);
    }

    if (method === 'GET' && pathSegments[0] === 'buyers' && pathSegments[2] === 'lots' && pathSegments[3]) {
      const buyerId = pathSegments[1];
      const lotId = pathSegments[3];
      const choices = await getBuyerChoices(supabase, buyerId, lotId);
      return jsonResponse(choices);
    }

    if (method === 'POST' && pathSegments[0] === 'buyers' && pathSegments[2] === 'choices') {
      const buyerId = pathSegments[1];
      const body = await req.json();
      const result = await saveBuyerChoices(supabase, buyerId, body);
      return jsonResponse(result);
    }

    if (method === 'POST' && pathSegments[0] === 'buyers' && pathSegments[2] === 'change-requests') {
      const buyerId = pathSegments[1];
      const body = await req.json();
      const changeRequest = await createChangeRequest(supabase, buyerId, body);
      return jsonResponse(changeRequest);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in materials function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function ensureProjectAccess(supabase: any, projectId: string, organizationId: string) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, organization_id')
    .eq('id', projectId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) throw error;
  if (!project) throw new Error('Projet introuvable ou accès non autorisé');

  return project;
}

async function getProjectCatalog(supabase: any, projectId: string, organizationId: string) {
  await ensureProjectAccess(supabase, projectId, organizationId);

  const { data: categories, error } = await supabase
    .from('material_categories')
    .select(`
      id,
      name,
      order_index,
      options:material_options(
        id,
        name,
        description,
        is_standard,
        extra_price,
        image_document_id
      )
    `)
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error) throw error;

  return categories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    order: cat.order_index,
    options: cat.options.map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      description: opt.description,
      isStandard: opt.is_standard,
      extraPrice: Number(opt.extra_price || 0),
      imageDocumentId: opt.image_document_id,
    })),
  }));
}

async function createCategory(supabase: any, projectId: string, body: any) {
  const { organizationId, name, order } = body;

  await ensureProjectAccess(supabase, projectId, organizationId);

  let orderIndex = order;
  if (orderIndex === undefined || orderIndex === null) {
    const { data: maxData } = await supabase
      .from('material_categories')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle();

    orderIndex = maxData ? maxData.order_index + 1 : 0;
  }

  const { data: category, error } = await supabase
    .from('material_categories')
    .insert({
      project_id: projectId,
      name,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: category.id,
    name: category.name,
    order: category.order_index,
  };
}

async function updateCategory(supabase: any, categoryId: string, body: any) {
  const { organizationId, name, order } = body;

  const { data: category, error: fetchError } = await supabase
    .from('material_categories')
    .select('id, project:projects(id, organization_id)')
    .eq('id', categoryId)
    .single();

  if (fetchError) throw fetchError;
  if (!category || category.project.organization_id !== organizationId) {
    throw new Error('Catégorie introuvable ou accès non autorisé');
  }

  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (order !== undefined) updates.order_index = order;

  const { data: updated, error } = await supabase
    .from('material_categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: updated.id,
    name: updated.name,
    order: updated.order_index,
  };
}

async function createOption(supabase: any, body: any) {
  const { organizationId, categoryId, name, description, isStandard, extraPrice, imageDocumentId } = body;

  const { data: category, error: fetchError } = await supabase
    .from('material_categories')
    .select('id, project:projects(id, organization_id)')
    .eq('id', categoryId)
    .single();

  if (fetchError) throw fetchError;
  if (!category || category.project.organization_id !== organizationId) {
    throw new Error('Catégorie introuvable ou accès non autorisé');
  }

  const { data: option, error } = await supabase
    .from('material_options')
    .insert({
      category_id: categoryId,
      name,
      description: description || null,
      is_standard: isStandard ?? false,
      extra_price: extraPrice || 0,
      image_document_id: imageDocumentId || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: option.id,
    categoryId: option.category_id,
    name: option.name,
    description: option.description,
    isStandard: option.is_standard,
    extraPrice: Number(option.extra_price || 0),
    imageDocumentId: option.image_document_id,
  };
}

async function updateOption(supabase: any, optionId: string, body: any) {
  const { organizationId, name, description, isStandard, extraPrice, imageDocumentId } = body;

  const { data: option, error: fetchError } = await supabase
    .from('material_options')
    .select(`
      id,
      category:material_categories(
        id,
        project:projects(id, organization_id)
      )
    `)
    .eq('id', optionId)
    .single();

  if (fetchError) throw fetchError;
  if (!option || option.category.project.organization_id !== organizationId) {
    throw new Error('Option introuvable ou accès non autorisé');
  }

  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (isStandard !== undefined) updates.is_standard = isStandard;
  if (extraPrice !== undefined) updates.extra_price = extraPrice;
  if (imageDocumentId !== undefined) updates.image_document_id = imageDocumentId;

  const { data: updated, error } = await supabase
    .from('material_options')
    .update(updates)
    .eq('id', optionId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    isStandard: updated.is_standard,
    extraPrice: Number(updated.extra_price || 0),
    imageDocumentId: updated.image_document_id,
  };
}

async function getBuyerChoices(supabase: any, buyerId: string, lotId: string) {
  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select('id, project_id')
    .eq('id', buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyer) throw new Error('Acheteur introuvable');

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, lot_number, rooms_label, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== buyer.project_id) {
    throw new Error('Lot introuvable pour cet acheteur');
  }

  const { data: categories } = await supabase
    .from('material_categories')
    .select(`
      id,
      name,
      order_index,
      options:material_options(
        id,
        name,
        description,
        is_standard,
        extra_price,
        image_document_id
      )
    `)
    .eq('project_id', buyer.project_id)
    .order('order_index', { ascending: true });

  const { data: choices } = await supabase
    .from('buyer_choices')
    .select('option_id')
    .eq('buyer_id', buyerId)
    .eq('lot_id', lotId);

  const selectedIds = new Set(choices?.map((c: any) => c.option_id) || []);

  const { data: changeRequests } = await supabase
    .from('buyer_change_requests')
    .select('id, description, status, extra_price, created_at')
    .eq('buyer_id', buyerId)
    .eq('lot_id', lotId)
    .order('created_at', { ascending: false });

  return {
    lot: {
      id: lot.id,
      lotNumber: lot.lot_number,
      roomsLabel: lot.rooms_label,
    },
    categories: categories?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      options: cat.options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description,
        isStandard: opt.is_standard,
        extraPrice: Number(opt.extra_price || 0),
        isSelected: selectedIds.has(opt.id),
      })),
    })) || [],
    changeRequests: changeRequests?.map((cr: any) => ({
      id: cr.id,
      description: cr.description,
      status: cr.status,
      extraPrice: cr.extra_price ? Number(cr.extra_price) : null,
      createdAt: cr.created_at,
    })) || [],
  };
}

async function saveBuyerChoices(supabase: any, buyerId: string, body: any) {
  const { lotId, selections } = body;

  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select('id, project_id')
    .eq('id', buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyer) throw new Error('Acheteur introuvable');

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== buyer.project_id) {
    throw new Error('Lot introuvable pour cet acheteur');
  }

  const optionIds = selections.map((s: any) => s.optionId);

  if (optionIds.length > 0) {
    const { data: options, error: optionsError } = await supabase
      .from('material_options')
      .select('id')
      .in('id', optionIds);

    if (optionsError) throw optionsError;
    if (options.length !== optionIds.length) {
      throw new Error('Certaines options sont invalides');
    }
  }

  const { error: deleteError } = await supabase
    .from('buyer_choices')
    .delete()
    .eq('buyer_id', buyerId)
    .eq('lot_id', lotId);

  if (deleteError) throw deleteError;

  if (optionIds.length > 0) {
    const { error: insertError } = await supabase
      .from('buyer_choices')
      .insert(
        optionIds.map((optionId: string) => ({
          buyer_id: buyerId,
          lot_id: lotId,
          option_id: optionId,
          status: 'SELECTED',
          decided_at: new Date().toISOString(),
        }))
      );

    if (insertError) throw insertError;
  }

  return getBuyerChoices(supabase, buyerId, lotId);
}

async function createChangeRequest(supabase: any, buyerId: string, body: any) {
  const { lotId, description } = body;

  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select('id, project_id')
    .eq('id', buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyer) throw new Error('Acheteur introuvable');

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .select('id, project_id')
    .eq('id', lotId)
    .maybeSingle();

  if (lotError) throw lotError;
  if (!lot || lot.project_id !== buyer.project_id) {
    throw new Error('Lot introuvable pour cet acheteur');
  }

  const { data: changeRequest, error } = await supabase
    .from('buyer_change_requests')
    .insert({
      buyer_id: buyerId,
      lot_id: lotId,
      description,
      status: 'REQUESTED',
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: changeRequest.id,
    description: changeRequest.description,
    status: changeRequest.status,
    extraPrice: changeRequest.extra_price ? Number(changeRequest.extra_price) : null,
    createdAt: changeRequest.created_at,
  };
}
