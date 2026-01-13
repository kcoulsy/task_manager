import { requireAuth } from "../../utils/require-auth";
import { findAllProjectsByUser } from "../../services/project.service";
import { handleServiceError } from "../../utils/errors";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);

  try {
    return await findAllProjectsByUser(session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
