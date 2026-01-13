import { requireAuth } from "../../utils/require-auth";
import { readValidatedBody } from "../../utils/validate";
import { CreateProjectSchema } from "../../schemas/project.schema";
import { createProject } from "../../services/project.service";
import { handleServiceError } from "../../utils/errors";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const body = await readValidatedBody(event, CreateProjectSchema);

  try {
    return await createProject(body, session.user.id);
  } catch (error) {
    handleServiceError(error);
  }
});
