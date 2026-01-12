<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import type { Task, Project } from "~~/generated/prisma/client";

const route = useRoute();
const projectId = route.params.id as string;
const taskId = route.params.taskId as string;

if (!projectId || !taskId) {
  throw createError({
    statusCode: 400,
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
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Task not found",
        });
      }
    },
  },
);

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "DONE":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-gray-100 text-gray-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "URGENT":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
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
              {{ task.status.replace("_", " ") }}
            </span>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Priority</h3>
            <span class="inline-block text-sm px-3 py-1 rounded font-medium" :class="getPriorityColor(task.priority)">
              {{ task.priority }}
            </span>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Due Date</h3>
            <p class="text-gray-600">{{ formatDate(task.dueDate) }}</p>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2">Created</h3>
            <p class="text-gray-600">{{ formatDate(task.createdAt) }}</p>
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
