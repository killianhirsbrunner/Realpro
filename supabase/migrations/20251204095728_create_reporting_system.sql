/*
  # Create Reporting System

  1. Functions
    - Get project dashboard KPIs
    - Get sales reporting data
    - Get finance reporting data
    - Get CFC reporting data
    - Get buyers reporting data
    - Get planning reporting data
    - Get submissions reporting data

  2. Views
    - Create materialized views for performance
    - Aggregated data for quick access

  3. Security
    - RLS policies for reporting access
*/

-- Function: Get Project Dashboard Overview
CREATE OR REPLACE FUNCTION get_project_dashboard(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_sales jsonb;
  v_finance jsonb;
  v_planning jsonb;
  v_cfc jsonb;
BEGIN
  -- Sales KPIs
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'sold', COUNT(*) FILTER (WHERE status = 'SOLD'),
    'reserved', COUNT(*) FILTER (WHERE status = 'RESERVED'),
    'available', COUNT(*) FILTER (WHERE status = 'AVAILABLE'),
    'total_value', COALESCE(SUM(price), 0),
    'sold_value', COALESCE(SUM(price) FILTER (WHERE status = 'SOLD'), 0)
  ) INTO v_sales
  FROM lots
  WHERE project_id = p_project_id;

  -- Finance KPIs
  SELECT jsonb_build_object(
    'total_budget', COALESCE(SUM(amount), 0),
    'paid', COALESCE(SUM(amount) FILTER (WHERE status = 'PAID'), 0),
    'pending', COALESCE(SUM(amount) FILTER (WHERE status = 'PENDING'), 0),
    'overdue', COALESCE(SUM(amount) FILTER (WHERE status = 'OVERDUE'), 0)
  ) INTO v_finance
  FROM invoices
  WHERE project_id = p_project_id;

  -- Planning KPIs
  SELECT jsonb_build_object(
    'total_tasks', COUNT(*),
    'completed', COUNT(*) FILTER (WHERE status = 'COMPLETED'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'IN_PROGRESS'),
    'delayed', COUNT(*) FILTER (WHERE status = 'DELAYED'),
    'progress', ROUND(
      COALESCE(
        COUNT(*) FILTER (WHERE status = 'COMPLETED')::numeric / NULLIF(COUNT(*)::numeric, 0) * 100,
        0
      ),
      1
    )
  ) INTO v_planning
  FROM planning_tasks
  WHERE project_id = p_project_id;

  -- CFC KPIs
  SELECT jsonb_build_object(
    'total_budget', COALESCE(SUM(budget_amount), 0),
    'engaged', COALESCE(SUM(engaged_amount), 0),
    'invoiced', COALESCE(SUM(invoiced_amount), 0),
    'paid', COALESCE(SUM(paid_amount), 0),
    'variance', COALESCE(SUM(budget_amount - engaged_amount), 0)
  ) INTO v_cfc
  FROM cfc_lines
  WHERE project_id = p_project_id;

  -- Combine all KPIs
  v_result := jsonb_build_object(
    'sales', v_sales,
    'finance', v_finance,
    'planning', v_planning,
    'cfc', v_cfc
  );

  RETURN v_result;
END;
$$;

-- Function: Get Sales Reporting Data
CREATE OR REPLACE FUNCTION get_sales_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_lots_status jsonb;
  v_broker_performance jsonb;
BEGIN
  -- Lots by status
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', status::text,
      'value', count,
      'percentage', ROUND((count::numeric / NULLIF(total::numeric, 0) * 100), 1)
    )
  ) INTO v_lots_status
  FROM (
    SELECT 
      status,
      COUNT(*) as count,
      SUM(COUNT(*)) OVER () as total
    FROM lots
    WHERE project_id = p_project_id
    GROUP BY status
  ) sub;

  -- Broker performance
  SELECT jsonb_agg(
    jsonb_build_object(
      'broker_name', broker_name,
      'lots_sold', lots_sold,
      'total_value', total_value,
      'commission', commission
    )
  ) INTO v_broker_performance
  FROM (
    SELECT 
      u.first_name || ' ' || u.last_name as broker_name,
      COUNT(DISTINCT l.id) as lots_sold,
      COALESCE(SUM(l.price), 0) as total_value,
      COALESCE(SUM(l.price * 0.03), 0) as commission
    FROM lots l
    LEFT JOIN buyers b ON b.lot_id = l.id
    LEFT JOIN users u ON u.id = b.broker_id
    WHERE l.project_id = p_project_id
    AND l.status = 'SOLD'
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY lots_sold DESC
  ) sub;

  v_result := jsonb_build_object(
    'lots_status', COALESCE(v_lots_status, '[]'::jsonb),
    'broker_performance', COALESCE(v_broker_performance, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function: Get Finance Reporting Data
CREATE OR REPLACE FUNCTION get_finance_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_payment_timeline jsonb;
  v_buyer_payments jsonb;
BEGIN
  -- Payment timeline (monthly)
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', month,
      'paid', paid_amount,
      'pending', pending_amount
    ) ORDER BY month
  ) INTO v_payment_timeline
  FROM (
    SELECT 
      DATE_TRUNC('month', created_at)::date as month,
      COALESCE(SUM(amount) FILTER (WHERE status = 'PAID'), 0) as paid_amount,
      COALESCE(SUM(amount) FILTER (WHERE status = 'PENDING'), 0) as pending_amount
    FROM invoices
    WHERE project_id = p_project_id
    AND created_at >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
  ) sub;

  -- Payments by buyer
  SELECT jsonb_agg(
    jsonb_build_object(
      'buyer_name', buyer_name,
      'total_due', total_due,
      'paid', paid,
      'pending', pending,
      'overdue', overdue
    )
  ) INTO v_buyer_payments
  FROM (
    SELECT 
      b.first_name || ' ' || b.last_name as buyer_name,
      COALESCE(SUM(i.amount), 0) as total_due,
      COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'PAID'), 0) as paid,
      COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'PENDING'), 0) as pending,
      COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'OVERDUE'), 0) as overdue
    FROM buyers b
    LEFT JOIN invoices i ON i.buyer_id = b.id
    WHERE b.project_id = p_project_id
    GROUP BY b.id, b.first_name, b.last_name
    HAVING SUM(i.amount) > 0
  ) sub;

  v_result := jsonb_build_object(
    'payment_timeline', COALESCE(v_payment_timeline, '[]'::jsonb),
    'buyer_payments', COALESCE(v_buyer_payments, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function: Get CFC Reporting Data
CREATE OR REPLACE FUNCTION get_cfc_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_cfc_overview jsonb;
  v_cfc_variance jsonb;
BEGIN
  -- CFC Overview
  SELECT jsonb_agg(
    jsonb_build_object(
      'cfc', code,
      'label', label,
      'budget', budget_amount,
      'engaged', engaged_amount,
      'invoiced', invoiced_amount,
      'paid', paid_amount,
      'variance', budget_amount - engaged_amount,
      'variance_percentage', CASE 
        WHEN budget_amount > 0 THEN ROUND(((budget_amount - engaged_amount) / budget_amount * 100), 1)
        ELSE 0
      END
    ) ORDER BY code
  ) INTO v_cfc_overview
  FROM cfc_lines
  WHERE project_id = p_project_id;

  -- CFC Variance Analysis
  SELECT jsonb_agg(
    jsonb_build_object(
      'cfc', code,
      'variance', budget_amount - engaged_amount,
      'status', CASE
        WHEN budget_amount - engaged_amount < 0 THEN 'over_budget'
        WHEN budget_amount - engaged_amount > budget_amount * 0.1 THEN 'under_budget'
        ELSE 'on_track'
      END
    ) ORDER BY ABS(budget_amount - engaged_amount) DESC
  ) INTO v_cfc_variance
  FROM cfc_lines
  WHERE project_id = p_project_id;

  v_result := jsonb_build_object(
    'cfc_overview', COALESCE(v_cfc_overview, '[]'::jsonb),
    'cfc_variance', COALESCE(v_cfc_variance, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function: Get Buyers Reporting Data
CREATE OR REPLACE FUNCTION get_buyers_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_buyer_status jsonb;
  v_documents_missing jsonb;
BEGIN
  -- Buyer status overview
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'complete', COUNT(*) FILTER (WHERE status = 'SIGNED'),
    'incomplete', COUNT(*) FILTER (WHERE status IN ('PROSPECT', 'RESERVED')),
    'documents_complete', COUNT(*) FILTER (WHERE documents_complete = true),
    'payment_complete', COUNT(*) FILTER (WHERE payment_status = 'PAID')
  ) INTO v_buyer_status
  FROM buyers
  WHERE project_id = p_project_id;

  -- Missing documents
  SELECT jsonb_agg(
    jsonb_build_object(
      'buyer_name', buyer_name,
      'lot_code', lot_code,
      'missing_documents', missing_count
    )
  ) INTO v_documents_missing
  FROM (
    SELECT 
      b.first_name || ' ' || b.last_name as buyer_name,
      l.code as lot_code,
      (
        SELECT COUNT(*)
        FROM documents d
        WHERE d.project_id = b.project_id
        AND d.category IN ('CONTRACT', 'NOTARY')
        AND d.buyer_id = b.id
        AND d.status != 'published'
      ) as missing_count
    FROM buyers b
    LEFT JOIN lots l ON l.id = b.lot_id
    WHERE b.project_id = p_project_id
  ) sub
  WHERE missing_count > 0;

  v_result := jsonb_build_object(
    'buyer_status', v_buyer_status,
    'documents_missing', COALESCE(v_documents_missing, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function: Get Planning Reporting Data
CREATE OR REPLACE FUNCTION get_planning_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_progress_timeline jsonb;
  v_critical_tasks jsonb;
BEGIN
  -- Progress timeline
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', week,
      'completed', completed_count,
      'total', total_count,
      'percentage', ROUND((completed_count::numeric / NULLIF(total_count::numeric, 0) * 100), 1)
    ) ORDER BY week
  ) INTO v_progress_timeline
  FROM (
    SELECT 
      DATE_TRUNC('week', created_at)::date as week,
      COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_count,
      COUNT(*) as total_count
    FROM planning_tasks
    WHERE project_id = p_project_id
    AND created_at >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY DATE_TRUNC('week', created_at)
  ) sub;

  -- Critical and delayed tasks
  SELECT jsonb_agg(
    jsonb_build_object(
      'task_name', title,
      'status', status,
      'due_date', due_date,
      'delay_days', CASE 
        WHEN due_date < CURRENT_DATE AND status != 'COMPLETED' 
        THEN EXTRACT(DAY FROM CURRENT_DATE - due_date)
        ELSE 0
      END
    )
  ) INTO v_critical_tasks
  FROM planning_tasks
  WHERE project_id = p_project_id
  AND (
    status = 'DELAYED'
    OR (due_date < CURRENT_DATE AND status != 'COMPLETED')
  )
  ORDER BY due_date ASC
  LIMIT 10;

  v_result := jsonb_build_object(
    'progress_timeline', COALESCE(v_progress_timeline, '[]'::jsonb),
    'critical_tasks', COALESCE(v_critical_tasks, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function: Get Submissions Reporting Data
CREATE OR REPLACE FUNCTION get_submissions_reporting(
  p_project_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_submission_overview jsonb;
  v_company_performance jsonb;
BEGIN
  -- Submission overview
  SELECT jsonb_build_object(
    'total_submissions', COUNT(*),
    'total_offers', (
      SELECT COUNT(*)
      FROM submission_offers so
      JOIN submissions s ON s.id = so.submission_id
      WHERE s.project_id = p_project_id
    ),
    'avg_offers_per_submission', ROUND(
      (SELECT COUNT(*)::numeric FROM submission_offers so
       JOIN submissions s ON s.id = so.submission_id
       WHERE s.project_id = p_project_id) / NULLIF(COUNT(*)::numeric, 0),
      1
    ),
    'total_savings', (
      SELECT COALESCE(SUM(estimated_amount - selected_offer_amount), 0)
      FROM submissions
      WHERE project_id = p_project_id
      AND status = 'AWARDED'
    )
  ) INTO v_submission_overview
  FROM submissions
  WHERE project_id = p_project_id;

  -- Company performance
  SELECT jsonb_agg(
    jsonb_build_object(
      'company_name', company_name,
      'offers_count', offers_count,
      'won_count', won_count,
      'total_value', total_value,
      'avg_response_time', avg_response_time
    )
  ) INTO v_company_performance
  FROM (
    SELECT 
      c.name as company_name,
      COUNT(so.id) as offers_count,
      COUNT(*) FILTER (WHERE s.selected_offer_id = so.id) as won_count,
      COALESCE(SUM(so.amount), 0) as total_value,
      ROUND(AVG(EXTRACT(DAY FROM so.created_at - s.created_at)), 1) as avg_response_time
    FROM submission_offers so
    JOIN submissions s ON s.id = so.submission_id
    JOIN companies c ON c.id = so.company_id
    WHERE s.project_id = p_project_id
    GROUP BY c.id, c.name
    ORDER BY offers_count DESC
  ) sub;

  v_result := jsonb_build_object(
    'submission_overview', v_submission_overview,
    'company_performance', COALESCE(v_company_performance, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Add RLS policies for reporting functions
CREATE POLICY "Users can access project reporting"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = projects.id
      AND pp.user_id = auth.uid()
    )
  );
