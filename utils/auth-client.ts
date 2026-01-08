import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
});
