<script setup lang="ts">
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import type { Task } from "~~/generated/prisma/client";

defineProps<{
  task: Task;
  projectId: string;
}>();

const { getStatusColor, getStatusCircleColor, getPriorityColor, formatDate, TASK_STATUS_LABELS, PRIORITY_LABELS } =
  useTaskHelpers();
</script>

<template>
  <div
    class="task-card bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer p-4 hover:scale-[1.005]"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Left: Title + Description -->
      <div class="flex-1 min-w-0">
        <h3 class="font-display text-xl text-editorial-navy font-semibold mb-1 truncate">
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="text-sm text-editorial-slate truncate">
          {{ task.description }}
        </p>
      </div>

      <!-- Right: Badges + Due Date -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Status Badge -->
        <span
          class="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md font-medium"
          :class="getStatusColor(task.status)"
        >
          <span class="w-2 h-2 rounded-full" :class="getStatusCircleColor(task.status)"></span>
          {{ TASK_STATUS_LABELS[task.status] }}
        </span>

        <!-- Priority Badge -->
        <span class="text-xs px-3 py-1.5 rounded-md font-medium" :class="getPriorityColor(task.priority)">
          {{ PRIORITY_LABELS[task.priority] }}
        </span>

        <!-- Due Date -->
        <div class="text-right">
          <div class="text-xs font-mono uppercase tracking-wide text-slate-500">Due</div>
          <div class="text-sm text-editorial-navy">
            {{ formatDate(task.dueDate) || "-" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
