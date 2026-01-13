<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import CommentSection from "~/components/CommentSection.vue";
import EditableTitle from "~/components/EditableTitle.vue";
import EditableDescription from "~/components/EditableDescription.vue";
import EditableStatus from "~/components/EditableStatus.vue";
import EditablePriority from "~/components/EditablePriority.vue";
import EditableDueDate from "~/components/EditableDueDate.vue";
import { ROUTES } from "~~/utils/routes";
import { HTTP_STATUS, FIVE_MINUTES } from "~~/utils/constants";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import type { Task, Project } from "~~/generated/prisma/client";
import type { Comment } from "~/types/comment";

const route = useRoute();
const projectId = route.params.id as string;
const taskId = route.params.taskId as string;

const { formatDate } = useTaskHelpers();

if (!projectId || !taskId) {
  throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Project ID and Task ID are required",
  });
}

definePageMeta({
  middleware: "require-auth",
});

const { data: initialTask } = await useFetch<Task & { project: Pick<Project, "id" | "name"> }>(
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

const queryKey = computed(() => ["task", projectId, taskId]);
const { data: task, isLoading } = useQuery({
  queryKey,
  queryFn: async () => {
    const data = await $fetch<Task & { project: Pick<Project, "id" | "name"> }>(ROUTES.API.TASK(projectId, taskId), {
      credentials: "include",
    });
    return data;
  },
  initialData: () => initialTask.value,
  staleTime: FIVE_MINUTES,
});

const { data: initialComments } = await useFetch<Comment[]>(ROUTES.API.TASK_COMMENTS(projectId, taskId), {
  server: true,
  query: { sort: "desc" },
  credentials: "include",
});

const formatDetailDate = (date: string | Date | null | undefined) => {
  return (
    formatDate(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || "Not set"
  );
};

useHead(
  computed(() => ({
    title: task.value ? `${task.value.title} - Task Manager` : "Task - Task Manager",
    meta: [
      {
        name: "description",
        content: task.value?.description
          ? `${task.value.title} - ${task.value.description.substring(0, 150)}${task.value.description.length > 150 ? "..." : ""}`
          : task.value?.title
            ? `View details for task: ${task.value.title}`
            : "View task details.",
      },
    ],
  })),
);
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
        <EditableTitle :title="task.title" :project-id="projectId" :task-id="taskId" />
      </CardHeader>
      <CardContent class="space-y-4">
        <EditableDescription :description="task.description" :project-id="projectId" :task-id="taskId" />

        <div class="grid grid-cols-2 gap-4">
          <EditableStatus :status="task.status" :project-id="projectId" :task-id="taskId" />

          <EditablePriority :priority="task.priority" :project-id="projectId" :task-id="taskId" />

          <EditableDueDate :due-date="task.dueDate" :project-id="projectId" :task-id="taskId" />

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

    <ClientOnly>
      <CommentSection :task-id="taskId" :project-id="projectId" :initial-comments="initialComments || []" />
    </ClientOnly>
  </div>
</template>
