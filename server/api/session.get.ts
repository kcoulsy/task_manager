import { getSession } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await getSession(event);
  return session;
});
