import { requireAuth } from "~~/server/utils/require-auth";
import { deleteProject } from "~~/server/services/project.service";
import { handleServiceError } from "~~/server/utils/errors";
import { ERROR_MESSAGES, HTTP_STATUS } from "~~/utils/constants";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: ERROR_MESSAGES.PROJECT_ID_REQUIRED,
    });
  }

  try {
    return await deleteProject(id, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
