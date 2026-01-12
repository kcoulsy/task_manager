import { getSession } from "../../../../utils/auth";
import { prisma } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getSession(event);

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const projectId = getRouterParam(event, "id");

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: session.user.id,
    },
  });

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
});
