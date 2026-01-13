import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { toggleReaction } from "~~/server/services/reaction.service";
import { handleServiceError } from "~~/server/utils/errors";
import { z } from "zod";
import { HTTP_STATUS } from "~~/utils/constants";

const ReactionSchema = z.object({
  emoji: z.string().min(1, "Emoji is required"),
});

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

  const body = await readValidatedBody(event, ReactionSchema);

  try {
    return await toggleReaction(commentId, session.user.id, body.emoji);
  } catch (error) {
    handleServiceError(error);
  }
});
