<script setup lang="ts">
import { ref } from "vue";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskFormDialog from "@/components/TaskFormDialog.vue";
import { ROUTES } from "~~/utils/routes";
import type { Project, Task } from "~~/generated/prisma/client";

const route = useRoute();
const projectId = route.params.id as string;

definePageMeta({
  middleware: "require-auth",
});

const { data: project, pending: isLoading } = await useFetch<Project>(ROUTES.API.PROJECT(projectId), {
  server: true,
  onResponseError({ response }) {
    if (response.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }
  },
});

const { data: tasks, refresh: refreshTasks } = await useFetch<Task[]>(ROUTES.API.PROJECT_TASKS(projectId), {
  server: true,
});

const isTaskDialogOpen = ref(false);

const handleTaskCreated = () => {
  refreshTasks();
};

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
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
    <p class="text-gray-500">Loading project...</p>
  </div>

  <div v-else-if="project" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ project.name }}</h1>
        <p v-if="project.description" class="text-gray-600">{{ project.description }}</p>
      </div>
      <Button variant="outline" @click="navigateTo('/app/dashboard')"> Back to Dashboard </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              {{ tasks?.length || 0 }} {{ tasks?.length === 1 ? "task" : "tasks" }} in this project
            </CardDescription>
          </div>
          <Button @click="isTaskDialogOpen = true">Create Task</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="!tasks || tasks.length === 0" class="text-center py-8 text-gray-500">
          No tasks yet. Create your first task to get started!
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-semibold text-sm text-gray-700">Title</th>
                <th class="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                <th class="text-left py-3 px-4 font-semibold text-sm text-gray-700">Priority</th>
                <th class="text-left py-3 px-4 font-semibold text-sm text-gray-700">Due Date</th>
                <th class="text-left py-3 px-4 font-semibold text-sm text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in tasks"
                :key="task.id"
                class="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                @click="navigateTo(ROUTES.APP.TASK(projectId, task.id))"
              >
                <td class="py-3 px-4">
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-sm text-gray-500 mt-1">
                    {{ task.description }}
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="text-xs px-2 py-1 rounded font-medium" :class="getStatusColor(task.status)">
                    {{ task.status.replace("_", " ") }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-xs px-2 py-1 rounded font-medium" :class="getPriorityColor(task.priority)">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ formatDate(task.dueDate) }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ formatDate(task.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <TaskFormDialog v-model:open="isTaskDialogOpen" :project-id="projectId" :on-refresh="handleTaskCreated" />
  </div>
</template>
