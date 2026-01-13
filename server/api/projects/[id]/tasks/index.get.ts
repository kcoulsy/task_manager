import { requireAuth } from "~~/server/utils/require-auth";
import { findAllTasksByProject } from "~~/server/services/task.service";
import { handleServiceError } from "~~/server/utils/errors";
import { ERROR_MESSAGES, HTTP_STATUS } from "~~/utils/constants";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const projectId = getRouterParam(event, "id");

  if (!projectId) {
    throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: ERROR_MESSAGES.PROJECT_ID_REQUIRED,
    });
  }

  try {
    return await findAllTasksByProject(projectId, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
