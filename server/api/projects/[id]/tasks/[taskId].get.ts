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
  const taskId = getRouterParam(event, "taskId");

  if (!projectId || !taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID and Task ID are required",
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

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      userId: session.user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return task;
});
