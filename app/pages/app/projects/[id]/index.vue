<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import TaskFormDialog from "~/components/TaskFormDialog.vue";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "~/stores/dialogStore";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import type { Project, Task } from "~~/generated/prisma/client";

const route = useRoute();
const projectId = route.params.id as string;

const { getStatusColor, getStatusCircleColor, getPriorityColor, formatDate, TASK_STATUS_LABELS } = useTaskHelpers();

// Must call composables BEFORE any await statements
const dialogStore = useDialogStore();

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

useHead(
  computed(() => ({
    title: project.value ? `${project.value.name} - Task Manager` : "Project - Task Manager",
    meta: [
      {
        name: "description",
        content: project.value?.description
          ? `View and manage tasks for ${project.value.name}. ${project.value.description}`
          : "View and manage your project tasks.",
      },
    ],
  })),
);

const { data: tasks, refresh: refreshTasks } = await useFetch<Task[]>(ROUTES.API.PROJECT_TASKS(projectId), {
  server: true,
});

const openTaskDialog = () => {
  dialogStore.openCreateTaskDialog(projectId);
};

const handleTaskCreated = () => {
  refreshTasks();
};
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
    <p class="text-editorial-slate">Loading project...</p>
  </div>

  <div v-else-if="project" class="min-h-screen bg-gradient-to-br from-indigo-50/30 via-slate-50 to-blue-50/20">
    <div class="max-w-[1400px] mx-auto pb-8 px-6 space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-display font-bold tracking-tight text-editorial-navy mb-2">
            {{ project.name }}
          </h1>
          <p v-if="project.description" class="text-editorial-slate">{{ project.description }}</p>
        </div>
        <Button
          variant="ghost"
          class="text-editorial-slate hover:text-editorial-navy"
          @click="navigateTo(ROUTES.APP.DASHBOARD)"
        >
          Back to Dashboard
        </Button>
      </div>

      <Card class="bg-white rounded-lg border border-gray-200 shadow-lg">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="font-display text-2xl text-editorial-navy">Tasks</CardTitle>
              <CardDescription class="text-editorial-slate">
                {{ tasks?.length || 0 }} {{ tasks?.length === 1 ? "task" : "tasks" }} in this project
              </CardDescription>
            </div>
            <Button class="bg-editorial-accent hover:bg-editorial-accent/90 text-white" @click="openTaskDialog">
              Create Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="!tasks || tasks.length === 0" class="text-center py-8 text-editorial-slate">
            No tasks yet. Create your first task to get started!
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-600">Title</th>
                  <th class="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-600">Status</th>
                  <th class="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-600">Priority</th>
                  <th class="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-600">Due Date</th>
                  <th class="text-left py-3 px-4 font-mono text-xs uppercase tracking-wide text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="task in tasks"
                  :key="task.id"
                  class="border-b border-gray-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  @click="navigateTo(ROUTES.APP.TASK(projectId, task.id))"
                >
                  <td class="py-3 px-4">
                    <div class="font-medium text-editorial-navy">{{ task.title }}</div>
                    <div v-if="task.description" class="text-sm text-editorial-slate mt-1 truncate max-w-md">
                      {{ task.description }}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      class="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md font-medium"
                      :class="getStatusColor(task.status)"
                    >
                      <span class="w-2 h-2 rounded-full" :class="getStatusCircleColor(task.status)"></span>
                      {{ TASK_STATUS_LABELS[task.status] }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-3 py-1.5 rounded-md font-medium" :class="getPriorityColor(task.priority)">
                      {{ task.priority }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-editorial-slate">
                    {{ formatDate(task.dueDate) || "-" }}
                  </td>
                  <td class="py-3 px-4 text-sm text-editorial-slate">
                    {{ formatDate(task.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ClientOnly>
        <TaskFormDialog :on-refresh="handleTaskCreated" />
      </ClientOnly>
    </div>
  </div>
</template>
