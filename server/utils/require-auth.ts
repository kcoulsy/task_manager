import type { H3Event } from "h3";
import { getSession } from "./auth";
import { HTTP_STATUS } from "~~/utils/constants";

export async function requireAuth(event: H3Event) {
  const session = await getSession(event);

  if (!session?.user?.id) {
    throw createError({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      statusMessage: "Unauthorized",
    });
  }

  return session;
}
