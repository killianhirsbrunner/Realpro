import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const WORKFLOW_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow`;

interface WorkflowDefinition {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  workflow_type: string;
  config: {
    steps: WorkflowStep[];
    transitions?: any[];
    notifications?: any[];
    approvers?: any[];
  };
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

interface WorkflowStep {
  key: string;
  name: string;
  order: number;
  assigned_role?: string;
  requires_approval: boolean;
}

interface WorkflowInstance {
  id: string;
  workflow_definition_id: string;
  organization_id: string;
  project_id?: string;
  entity_type: string;
  entity_id: string;
  current_step_key: string;
  status: 'active' | 'completed' | 'cancelled' | 'on_hold' | 'failed';
  started_at: string;
  completed_at?: string;
  due_date?: string;
  initiator_id: string;
  assigned_to?: string;
  context: any;
  created_at: string;
  updated_at: string;
  workflow_definition?: WorkflowDefinition;
  workflow_steps?: WorkflowStepInstance[];
  workflow_transitions?: WorkflowTransition[];
  project?: { id: string; name: string };
  initiator?: { id: string; first_name: string; last_name: string; email: string };
  assigned_user?: { id: string; first_name: string; last_name: string; email: string };
}

interface WorkflowStepInstance {
  id: string;
  workflow_instance_id: string;
  step_key: string;
  step_name: string;
  step_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  assigned_to?: string;
  assigned_role?: string;
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  input_data: any;
  output_data: any;
  created_at: string;
  updated_at: string;
  assigned_user?: { id: string; first_name: string; last_name: string; email: string };
  approved_user?: { id: string; first_name: string; last_name: string; email: string };
}

interface WorkflowTransition {
  id: string;
  workflow_instance_id: string;
  workflow_step_id?: string;
  from_status: string;
  to_status: string;
  triggered_by: string;
  triggered_at: string;
  transition_type: 'automatic' | 'manual' | 'scheduled' | 'conditional';
  comment?: string;
  decision_data: any;
  created_at: string;
  triggered_user?: { id: string; first_name: string; last_name: string; email: string };
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// List workflow definitions
export function useWorkflowDefinitions(organizationId?: string, workflowType?: string) {
  const [definitions, setDefinitions] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDefinitions() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (organizationId) params.append('organizationId', organizationId);
        if (workflowType) params.append('type', workflowType);

        const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/definitions?${params}`);
        setDefinitions(result.data || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDefinitions();
  }, [organizationId, workflowType]);

  return { definitions, loading, error };
}

// Start a new workflow
export function useStartWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startWorkflow = async (params: {
    workflowType: string;
    entityType: string;
    entityId: string;
    organizationId: string;
    projectId?: string;
  }): Promise<WorkflowInstance | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/start`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return result.data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { startWorkflow, loading, error };
}

// Get workflow instance details
export function useWorkflowInstance(instanceId: string | null) {
  const [instance, setInstance] = useState<WorkflowInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!instanceId) {
      setInstance(null);
      return;
    }

    async function fetchInstance() {
      try {
        setLoading(true);
        const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/instances/${instanceId}`);
        setInstance(result.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstance();
  }, [instanceId]);

  const refresh = async () => {
    if (!instanceId) return;

    try {
      const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/instances/${instanceId}`);
      setInstance(result.data);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { instance, loading, error, refresh };
}

// List workflow instances
export function useWorkflowInstances(filters: {
  organizationId?: string;
  projectId?: string;
  status?: string;
}) {
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInstances() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.organizationId) params.append('organizationId', filters.organizationId);
        if (filters.projectId) params.append('projectId', filters.projectId);
        if (filters.status) params.append('status', filters.status);

        const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/instances?${params}`);
        setInstances(result.data || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstances();
  }, [filters.organizationId, filters.projectId, filters.status]);

  return { instances, loading, error };
}

// Transition workflow to next step
export function useTransitionWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const transition = async (params: {
    instanceId: string;
    currentStepKey: string;
    nextStepKey?: string;
    comment?: string;
  }): Promise<WorkflowInstance | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/transition`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return result.data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { transition, loading, error };
}

// Approve workflow step
export function useApproveWorkflowStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = async (params: {
    instanceId: string;
    stepId: string;
    comment?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/approve`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { approve, loading, error };
}

// Reject workflow step
export function useRejectWorkflowStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reject = async (params: {
    instanceId: string;
    stepId: string;
    reason: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/reject`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reject, loading, error };
}

// Cancel workflow
export function useCancelWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = async (params: {
    instanceId: string;
    reason?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/cancel`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading, error };
}

// Execute workflow actions
export function useExecuteWorkflowActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (params: {
    workflowInstanceId: string;
    triggerEvent: string;
    stepKey?: string;
  }): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWithAuth(`${WORKFLOW_FUNCTION_URL}/execute-actions`, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      return result;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

// Helper: Get current step details
export function getCurrentStep(instance: WorkflowInstance | null): WorkflowStepInstance | null {
  if (!instance || !instance.workflow_steps || !instance.current_step_key) {
    return null;
  }

  return instance.workflow_steps.find(
    step => step.step_key === instance.current_step_key
  ) || null;
}

// Helper: Get workflow progress percentage
export function getWorkflowProgress(instance: WorkflowInstance | null): number {
  if (!instance || !instance.workflow_steps || instance.workflow_steps.length === 0) {
    return 0;
  }

  const completedSteps = instance.workflow_steps.filter(
    step => step.status === 'completed'
  ).length;

  return Math.round((completedSteps / instance.workflow_steps.length) * 100);
}

// Helper: Check if user can approve current step
export function canApproveCurrentStep(instance: WorkflowInstance | null, userId: string): boolean {
  const currentStep = getCurrentStep(instance);

  if (!currentStep || !currentStep.requires_approval) {
    return false;
  }

  if (currentStep.status !== 'in_progress') {
    return false;
  }

  // Check if assigned to user
  if (currentStep.assigned_to && currentStep.assigned_to === userId) {
    return true;
  }

  return false;
}

export type {
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowStep,
  WorkflowStepInstance,
  WorkflowTransition,
};
