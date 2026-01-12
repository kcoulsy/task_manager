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

  const body = await readBody(event);
  const { name, description } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project name is required",
    });
  }

  const project = await prisma.project.create({
    data: {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description?.trim() || null,
      userId: session.user.id,
    },
  });

  return project;
});
