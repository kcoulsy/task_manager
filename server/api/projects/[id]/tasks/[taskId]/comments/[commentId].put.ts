import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { UpdateCommentSchema, type UpdateCommentInput } from "~~/server/schemas/comment.schema";
import { updateComment } from "~~/server/services/comment.service";
import { handleServiceError } from "~~/server/utils/errors";
import { HTTP_STATUS } from "~~/utils/constants";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const projectId = getRouterParam(event, "id");
  const taskId = getRouterParam(event, "taskId");
  const commentId = getRouterParam(event, "commentId");

  if (!projectId || !taskId || !commentId) {
    throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Project ID, Task ID, and Comment ID are required",
    });
  }

  const body = (await readValidatedBody(event, UpdateCommentSchema)) as UpdateCommentInput;

  try {
    return await updateComment(commentId, session.user.id, body);
  } catch (error) {
    handleServiceError(error);
  }
});
