/**
 * Standardized TanStack Query Keys for the Task Module.
 * Ensures strict cache invalidation patterns.
 */
export const TASK_QUERY_KEYS = {
  // Base task keys
  all: ['tasks'] as const,
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...TASK_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...TASK_QUERY_KEYS.details(), id] as const,
  
  // Comments
  comments: (taskId: number) => [...TASK_QUERY_KEYS.detail(taskId), 'comments'] as const,
  
  // Checklists
  checklists: (taskId: number) => [...TASK_QUERY_KEYS.detail(taskId), 'checklists'] as const,

  // Followers
  followers: (taskId: number) => [...TASK_QUERY_KEYS.detail(taskId), 'followers'] as const,

  // Dependencies
  dependencies: (taskId: number) => [...TASK_QUERY_KEYS.detail(taskId), 'dependencies'] as const,

  // Time Logs
  timeLogs: (taskId: number) => [...TASK_QUERY_KEYS.detail(taskId), 'time-logs'] as const,

  // Configuration / Masters
  statuses: ['tasks', 'statuses'] as const,
  priorities: ['tasks', 'priorities'] as const,
  customFields: ['tasks', 'custom-fields'] as const,
  templates: ['tasks', 'templates'] as const,
  statusTransitions: ['tasks', 'status-transitions'] as const,
};
