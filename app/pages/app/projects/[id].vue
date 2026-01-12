<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import type { Project, Task } from "~~/generated/prisma/client";

const route = useRoute();
const projectId = route.params.id as string;

definePageMeta({
  middleware: "require-auth",
});

const { data: project, pending: isLoading } = await useFetch<Project & { tasks: Task[] }>(
  ROUTES.API.PROJECT(projectId),
  {
    server: true,
    onResponseError({ response }) {
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        });
      }
    },
  },
);
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
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          {{ project.tasks.length }} {{ project.tasks.length === 1 ? "task" : "tasks" }} in this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="project.tasks.length === 0" class="text-center py-8 text-gray-500">
          No tasks yet. Create your first task to get started!
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="task in project.tasks"
            :key="task.id"
            class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 class="font-semibold">{{ task.title }}</h3>
            <p v-if="task.description" class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                {{ task.status }}
              </span>
              <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                {{ task.priority }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
