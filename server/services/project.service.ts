import { prisma } from "~~/utils/db";
import { notFoundError } from "../utils/errors";
import type { CreateProjectInput, UpdateProjectInput } from "../schemas/project.schema";

export async function findAllProjectsByUser(userId: string) {
  return prisma.project.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function findProjectByIdForUser(id: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!project) {
    throw notFoundError("Project not found");
  }

  return project;
}

export async function findProjectByIdWithTasks(id: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
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
    throw notFoundError("Project not found");
  }

  return project;
}

export async function createProject(data: CreateProjectInput, userId: string) {
  return prisma.project.create({
    data: {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description || null,
      userId,
    },
  });
}

export async function updateProject(id: string, userId: string, data: UpdateProjectInput) {
  await findProjectByIdForUser(id, userId);

  return prisma.project.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description || null,
    },
  });
}

export async function deleteProject(id: string, userId: string) {
  await findProjectByIdForUser(id, userId);

  await prisma.project.delete({
    where: {
      id,
    },
  });

  return { success: true };
}
