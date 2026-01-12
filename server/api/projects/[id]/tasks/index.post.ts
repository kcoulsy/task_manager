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

  const body = await readBody(event);
  const { title, description, status, priority, dueDate } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task title is required",
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

  const task = await prisma.task.create({
    data: {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || null,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      projectId,
      userId: session.user.id,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return task;
});
