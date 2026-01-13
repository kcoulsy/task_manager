import { computed, type MaybeRefOrGetter } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ROUTES } from "~~/utils/routes";
import { authClient } from "~~/utils/auth-client";
import { toast } from "vue-sonner";
import type { Comment } from "~/types/comment";
import { toValue } from "vue";

export function useCreateComment(
  projectId: string,
  taskId: string,
  sortOrder: MaybeRefOrGetter<"asc" | "desc">,
) {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const queryKey = computed(() => ["comments", projectId, taskId, toValue(sortOrder)]);

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await $fetch<Comment>(ROUTES.API.TASK_COMMENTS(projectId, taskId), {
        method: "POST",
        body: { content },
        credentials: "include",
      });

      return response;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: queryKey.value,
      });

      const previousComments = queryClient.getQueryData<Comment[]>(queryKey.value);

      const userId = session.value?.data?.user?.id || "";
      const userEmail = session.value?.data?.user?.email || "";
      const userName = session.value?.data?.user?.name || userEmail.split("@")[0] || "User";

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        createdAt: new Date(),
        user: {
          id: userId,
          name: userName,
          email: userEmail,
        },
        reactions: [],
        updatedAt: new Date(),
        taskId: taskId,
        userId: userId,
        parentId: null,
        replies: [],
      };

      queryClient.setQueryData<Comment[]>(queryKey.value, (old = []) => {
        const newComments = [...old, optimisticComment];
        const currentSortOrder = toValue(sortOrder);

        return newComments.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return currentSortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
      });

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey.value, context.previousComments);
      }
      toast.error("Failed to create comment");
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: queryKey.value,
        });
      }, 1000);
    },
  });

  const createComment = async (content: string) => {
    if (!content.trim()) return;

    await createCommentMutation.mutateAsync(content.trim());
  };

  return {
    createComment,
    isPending: computed(() => createCommentMutation.isPending.value),
  };
}
