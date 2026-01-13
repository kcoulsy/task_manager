import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { CreateCommentSchema, type CreateCommentInput } from "~~/server/schemas/comment.schema";
import { createComment } from "~~/server/services/comment.service";
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

  const body = (await readValidatedBody(event, CreateCommentSchema)) as CreateCommentInput;

  try {
    return await createComment(taskId, session.user.id, body);
  } catch (error) {
    handleServiceError(error);
  }
});
