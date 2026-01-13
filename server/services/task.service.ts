import { prisma } from "~~/utils/db";
import { notFoundError } from "../utils/errors";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";
import { findProjectByIdForUser } from "./project.service";

export async function findAllTasksByProject(projectId: string, userId: string) {
  await findProjectByIdForUser(projectId, userId);

  return prisma.task.findMany({
    where: {
      projectId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findTaskById(projectId: string, taskId: string, userId: string) {
  await findProjectByIdForUser(projectId, userId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      userId,
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
    throw notFoundError("Task not found");
  }

  return task;
}

export async function createTask(projectId: string, userId: string, data: CreateTaskInput) {
  await findProjectByIdForUser(projectId, userId);

  return prisma.task.create({
    data: {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      projectId,
      userId,
      dueDate: data.dueDate ?? null,
    },
  });
}

export async function updateTask(projectId: string, taskId: string, userId: string, data: UpdateTaskInput) {
  await findTaskById(projectId, taskId, userId);

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ?? null }),
    },
  });
}

export async function deleteTask(projectId: string, taskId: string, userId: string) {
  await findTaskById(projectId, taskId, userId);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return { success: true };
}
