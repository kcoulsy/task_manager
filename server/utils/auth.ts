import { auth } from "~~/utils/auth";
import type { H3Event } from "h3";

export async function getSession(event: H3Event) {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  return session;
}
