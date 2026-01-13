import type { TaskStatus, Priority } from "~~/generated/prisma/enums";
import {
  TASK_STATUS_COLORS,
  TASK_STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  TASK_STATUS,
  PRIORITY,
} from "~~/utils/constants";

export function useTaskHelpers() {
  const getStatusColor = (status: TaskStatus) => TASK_STATUS_COLORS[status] ?? TASK_STATUS_COLORS.TODO;

  const getStatusLabel = (status: TaskStatus) => TASK_STATUS_LABELS[status] ?? status;

  const getStatusCircleColor = (status: TaskStatus): string => {
    const circleColors: Record<TaskStatus, string> = {
      TODO: "bg-gray-700",
      IN_PROGRESS: "bg-blue-700",
      DONE: "bg-green-700",
      CANCELLED: "bg-red-700",
    };
    return circleColors[status] ?? circleColors.TODO;
  };

  const getPriorityColor = (priority: Priority) => PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.MEDIUM;

  const getPriorityLabel = (priority: Priority) => PRIORITY_LABELS[priority] ?? priority;

  const formatDate = (date: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    const isoString = d.toISOString();
    const datePart = isoString.split("T")[0];
    return datePart ?? "";
  };

  return {
    getStatusColor,
    getStatusLabel,
    getStatusCircleColor,
    getPriorityColor,
    getPriorityLabel,
    formatDate,
    formatDateForInput,
    TASK_STATUS,
    PRIORITY,
    TASK_STATUS_LABELS,
    PRIORITY_LABELS,
  };
}
