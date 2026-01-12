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

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return project;
});
