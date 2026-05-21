import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectWithRelations } from '@/types';

interface ProjectsResponse {
  projects: ProjectWithRelations[];
}

interface CreateProjectData {
  title: string;
  description?: string;
  sourceUrl?: string;
  sourceVideoUrl?: string;
  channelId?: string | null;
}

export function useProjects() {
  const queryClient = useQueryClient();

  // Fetch all projects
  const { data, isLoading, error } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch projects');
      }
      return response.json();
    },
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProjectData> }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: data?.projects ?? [],
    isLoading,
    error,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  };
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<{ project: ProjectWithRelations }>({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!id,
  });

  return {
    project: data?.project,
    isLoading,
    error,
  };
}
