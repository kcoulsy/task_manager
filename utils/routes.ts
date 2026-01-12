export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  APP: {
    DASHBOARD: "/app/dashboard",
    PROJECT: (id: string) => `/app/projects/${id}`,
    TASK: (projectId: string, taskId: string) => `/app/projects/${projectId}/tasks/${taskId}`,
  },
  API: {
    SESSION: "/api/session",
    PROJECTS: "/api/projects",
    PROJECT: (id: string) => `/api/projects/${id}`,
    PROJECT_TASKS: (projectId: string) => `/api/projects/${projectId}/tasks`,
    TASK: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
  },
} as const;

export type RouteKeys = typeof ROUTES;
