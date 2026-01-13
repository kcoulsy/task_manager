import { requireAuth } from "~~/server/utils/require-auth";
import { findAllCommentsByTask } from "~~/server/services/comment.service";
import { handleServiceError } from "~~/server/utils/errors";
import { readValidatedQuery } from "~~/server/utils/validate";
import { z } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "~~/utils/constants";

const SortQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
});

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
    const query = await readValidatedQuery(event, SortQuerySchema);
    return await findAllCommentsByTask(taskId, session.user.id, query.sort);
  } catch (error) {
    handleServiceError(error);
  }
});
