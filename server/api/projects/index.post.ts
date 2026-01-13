import { requireAuth } from "~~/server/utils/require-auth";
import { readValidatedBody } from "~~/server/utils/validate";
import { CreateProjectSchema } from "~~/server/schemas/project.schema";
import { createProject } from "~~/server/services/project.service";
import { handleServiceError } from "~~/server/utils/errors";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const body = await readValidatedBody(event, CreateProjectSchema);

  try {
    return await createProject(body, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
