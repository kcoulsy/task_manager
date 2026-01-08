import { createAuthClient } from "better-auth/vue";

console.log("import.meta.env.VITE_BASE_URL", import.meta.env.VITE_BASE_URL);
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
});
