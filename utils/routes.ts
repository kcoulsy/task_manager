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
    AUTH: {
      BASE: "/api/auth",
      LOGIN: "/api/auth/sign-in/email",
      REGISTER: "/api/auth/sign-up/email",
      SIGNOUT: "/api/auth/sign-out",
      ALL: "/api/auth/[...all]",
    },
    PROJECTS: "/api/projects",
    PROJECT: (id: string) => `/api/projects/${id}`,
    PROJECT_TASKS: (projectId: string) => `/api/projects/${projectId}/tasks`,
    TASK: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
    PROJECTS_DETAILED: {
      BASE: "/api/projects",
      LIST: "/api/projects",
      CREATE: "/api/projects",
      BY_ID: (id: string) => `/api/projects/${id}`,
      UPDATE: (id: string) => `/api/projects/${id}`,
      DELETE: (id: string) => `/api/projects/${id}`,
    },
    TASKS_DETAILED: {
      LIST: (projectId: string) => `/api/projects/${projectId}/tasks`,
      CREATE: (projectId: string) => `/api/projects/${projectId}/tasks`,
      BY_ID: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
      UPDATE: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
      DELETE: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
    },
    TASK_COMMENTS: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}/comments`,
    TASK_COMMENT: (projectId: string, taskId: string, commentId: string) => `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    COMMENT_REACTIONS: (projectId: string, taskId: string, commentId: string) => `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}/reactions`,
  },
} as const;

export type RouteKeys = typeof ROUTES;
