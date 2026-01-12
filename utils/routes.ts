export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  APP: {
    DASHBOARD: "/app/dashboard",
    PROJECT: (id: string) => `/app/projects/${id}`,
  },
  API: {
    SESSION: "/api/session",
    PROJECTS: "/api/projects",
    PROJECT: (id: string) => `/api/projects/${id}`,
  },
} as const;

export type RouteKeys = typeof ROUTES;
