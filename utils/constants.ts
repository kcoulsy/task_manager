import type { TaskStatus, Priority } from "~~/generated/prisma/enums";

export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
  DONE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-50 text-slate-700 border border-slate-200",
};

export const PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-50 text-slate-700 border border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border border-orange-200",
  URGENT: "bg-red-50 text-red-700 border border-red-200 shadow-sm shadow-red-100",
};

export const ERROR_MESSAGES = {
  PROJECT_ID_REQUIRED: "Project ID is required",
  PROJECT_AND_TASK_ID_REQUIRED: "Project ID and Task ID are required",
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const FIVE_MINUTES = ONE_MINUTE * 5;

export const EMOJI_REACTION_OPTIONS = ["👍", "👎", "❤️", "😂", "😮", "😢", "🎉", "🔥"] as const;
