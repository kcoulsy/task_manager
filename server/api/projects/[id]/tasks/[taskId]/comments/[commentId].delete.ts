import { requireAuth } from "~~/server/utils/require-auth";
import { deleteComment } from "~~/server/services/comment.service";
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

  try {
    return await deleteComment(commentId, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
