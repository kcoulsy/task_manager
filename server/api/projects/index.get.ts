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

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return projects;
});
