import { useQuery } from '@tanstack/react-query';

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
  head_branch: string;
  event: string;
  workflow_id: number;
}

interface GitHubWorkflowRunsResponse {
  total_count: number;
  workflow_runs: WorkflowRun[];
}

const GITHUB_OWNER = 'AiltonDomingues';
const GITHUB_REPO = 'ia-explicada-hub';

export const useGitHubWorkflows = () => {
  return useQuery({
    queryKey: ['github-workflows'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs?per_page=5`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub workflows');
        }

        const data: GitHubWorkflowRunsResponse = await response.json();
        return data.workflow_runs;
      } catch (error) {
        console.error('Error fetching GitHub workflows:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  });
};
