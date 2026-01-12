import { getSession } from "../../utils/auth";
import { prisma } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getSession(event);
  
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { name, description } = body;

  // Check if project exists and belongs to user
  const existingProject = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingProject) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project name is required",
    });
  }

  const project = await prisma.project.update({
    where: {
      id,
    },
    data: {
      name: name.trim(),
      description: description?.trim() || null,
    },
  });

  return project;
});
