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

  await prisma.project.delete({
    where: {
      id,
    },
  });

  return { success: true };
});
