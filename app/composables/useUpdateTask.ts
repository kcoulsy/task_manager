import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ROUTES } from "~~/utils/routes";
import type { Task, Project } from "~~/generated/prisma/client";
import type { UpdateTaskInput } from "~~/server/schemas/task.schema";

export function useUpdateTask(projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = computed(() => ["task", projectId, taskId]);

  const updateTaskMutation = useMutation({
    mutationFn: async (data: UpdateTaskInput) => {
      const response = await $fetch<Task & { project: Pick<Project, "id" | "name"> }>(
        ROUTES.API.TASK(projectId, taskId),
        {
          method: "PUT",
          body: data,
          credentials: "include",
        },
      );

      return response;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: queryKey.value,
      });

      const previousTask = queryClient.getQueryData<Task & { project: Pick<Project, "id" | "name"> }>(queryKey.value);

      if (previousTask) {
        queryClient.setQueryData<Task & { project: Pick<Project, "id" | "name"> }>(queryKey.value, (old) => {
          if (!old) return old;
          return {
            ...old,
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description ?? null }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.priority !== undefined && { priority: data.priority }),
            ...(data.dueDate !== undefined && { dueDate: data.dueDate ?? null }),
          };
        });
      }

      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(queryKey.value, context.previousTask);
      }
      alert("Failed to update task");
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: queryKey.value,
        });
      }, 1000);
    },
  });

  const updateTask = async (data: UpdateTaskInput) => {
    await updateTaskMutation.mutateAsync(data);
  };

  return {
    updateTask,
    isPending: computed(() => updateTaskMutation.isPending.value),
  };
}
