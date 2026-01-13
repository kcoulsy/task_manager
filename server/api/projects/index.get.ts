import { requireAuth } from "~~/server/utils/require-auth";
import { findAllProjectsByUser } from "~~/server/services/project.service";
import { handleServiceError } from "~~/server/utils/errors";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);

  try {
    return await findAllProjectsByUser(session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
