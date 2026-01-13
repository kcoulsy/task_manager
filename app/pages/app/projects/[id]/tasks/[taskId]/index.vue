<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import { HTTP_STATUS } from "~~/utils/constants";
import { useTaskHelpers } from "@/composables/useTaskHelpers";
import type { Task, Project } from "~~/generated/prisma/client";

const route = useRoute();
const projectId = route.params.id as string;
const taskId = route.params.taskId as string;

const { getStatusColor, getPriorityColor, formatDate, TASK_STATUS_LABELS, PRIORITY_LABELS } = useTaskHelpers();

if (!projectId || !taskId) {
  throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Project ID and Task ID are required",
  });
}

definePageMeta({
  middleware: "require-auth",
});

const { data: task, pending: isLoading } = await useFetch<Task & { project: Pick<Project, "id" | "name"> }>(
  ROUTES.API.TASK(projectId, taskId),
  {
    server: true,
    onResponseError({ response }) {
      if (response.status === HTTP_STATUS.NOT_FOUND) {
        throw createError({
          statusCode: HTTP_STATUS.NOT_FOUND,
          statusMessage: "Task not found",
        });
      }
    },
  },
);

const formatDetailDate = (date: string | Date | null | undefined) => {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) || "Not set";
};
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
    <p class="text-gray-500">Loading task...</p>
  </div>

  <div v-else-if="task" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Button variant="outline" @click="navigateTo(ROUTES.APP.PROJECT(projectId))"> ← Back to Project </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">{{ task.title }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="task.description">
          <h3 class="font-semibold text-sm text-gray-700 mb-2">Description</h3>
          <p class="text-gray-600 whitespace-pre-wrap">{{ task.description }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Status</h3>
            <span class="inline-block text-sm px-3 py-1 rounded font-medium" :class="getStatusColor(task.status)">
              {{ TASK_STATUS_LABELS[task.status] }}
            </span>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Priority</h3>
            <span class="inline-block text-sm px-3 py-1 rounded font-medium" :class="getPriorityColor(task.priority)">
              {{ PRIORITY_LABELS[task.priority] }}
            </span>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Due Date</h3>
            <p class="text-gray-600">{{ formatDetailDate(task.dueDate) }}</p>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Created</h3>
            <p class="text-gray-600">{{ formatDetailDate(task.createdAt) }}</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-sm text-gray-700 mb-2">Project</h3>
          <p class="text-gray-600">{{ task.project.name }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
