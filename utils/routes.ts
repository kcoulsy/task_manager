export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  APP: {
    DASHBOARD: "/app/dashboard",
  },
  API: {
    SESSION: "/api/session",
  },
} as const;

export type RouteKeys = typeof ROUTES;
