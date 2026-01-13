import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { CreateTaskSchema, type CreateTaskInput } from "~~/server/schemas/task.schema";
import { createTask } from "~~/server/services/task.service";
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

  const body = (await readValidatedBody(event, CreateTaskSchema)) as CreateTaskInput;

  try {
    return await createTask(projectId, session.user.id, body);
  } catch (error) {
    handleServiceError(error);
  }
});
