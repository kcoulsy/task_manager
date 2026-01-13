import { z } from "zod";
import { TASK_STATUS, PRIORITY } from "~~/utils/constants";
import type { TaskStatus, Priority } from "~~/generated/prisma/enums";

const TaskStatusEnum = z.enum([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE, TASK_STATUS.CANCELLED] as [
  TaskStatus,
  TaskStatus,
  TaskStatus,
  TaskStatus,
]);

const PriorityEnum = z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.URGENT] as [
  Priority,
  Priority,
  Priority,
  Priority,
]);

const DateSchema = z.union([z.string(), z.date(), z.null()]).transform((val): Date | null => {
  if (val === null) return null;
  return val instanceof Date ? val : new Date(val);
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").trim(),
  description: z.string().trim().optional().nullable(),
  status: TaskStatusEnum.default(TASK_STATUS.TODO),
  priority: PriorityEnum.default(PRIORITY.MEDIUM),
  dueDate: DateSchema.optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").trim().optional(),
  description: z.string().trim().optional().nullable(),
  status: TaskStatusEnum.optional(),
  priority: PriorityEnum.optional(),
  dueDate: DateSchema.optional(),
});

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date | null;
};
