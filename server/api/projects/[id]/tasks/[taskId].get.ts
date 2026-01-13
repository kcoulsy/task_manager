import { requireAuth } from "~~/server/utils/require-auth";
import { findTaskById } from "~~/server/services/task.service";
import { handleServiceError } from "~~/server/utils/errors";
import { ERROR_MESSAGES, HTTP_STATUS } from "~~/utils/constants";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const projectId = getRouterParam(event, "id");
  const taskId = getRouterParam(event, "taskId");

  if (!projectId || !taskId) {
    throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: ERROR_MESSAGES.PROJECT_AND_TASK_ID_REQUIRED,
    });
  }

  try {
    return await findTaskById(projectId, taskId, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
