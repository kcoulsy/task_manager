import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { UpdateProjectSchema } from "~~/server/schemas/project.schema";
import { updateProject } from "~~/server/services/project.service";
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

  const body = await readValidatedBody(event, UpdateProjectSchema);

  try {
    return await updateProject(id, session.user.id, body);
  } catch (error) {
    handleServiceError(error);
  }
});
