import { computed, type MaybeRefOrGetter } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ROUTES } from "~~/utils/routes";
import { authClient } from "~~/utils/auth-client";
import { toast } from "vue-sonner";
import type { Comment } from "~/types/comment";
import { toValue } from "vue";

export function useCreateReply(
  projectId: string,
  taskId: string,
  parentCommentId: string,
  sortOrder: MaybeRefOrGetter<"asc" | "desc">,
) {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const queryKey = computed(() => ["comments", projectId, taskId, toValue(sortOrder)]);

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await $fetch<Comment>(ROUTES.API.TASK_COMMENTS(projectId, taskId), {
        method: "POST",
        body: { content, parentId: parentCommentId },
        credentials: "include",
      });
      return response;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: queryKey.value });
      const previousComments = queryClient.getQueryData<Comment[]>(queryKey.value);

      const userId = session.value?.data?.user?.id || "";
      const userEmail = session.value?.data?.user?.email || "";
      const userName = session.value?.data?.user?.name || userEmail.split("@")[0] || "User";

      const optimisticReply = {
        id: `temp-reply-${Date.now()}`,
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
        parentId: parentCommentId,
        replies: [],
      } as Comment;

      queryClient.setQueryData(queryKey.value, (old: Comment[] | undefined) => {
        const comments = [...(old || [])];
        return comments.map((comment: Comment) => {
          if (comment.id !== parentCommentId) return comment;
          return {
            ...comment,
            replies: [optimisticReply, ...(comment.replies || [])],
          };
        });
      });

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey.value, context.previousComments);
      }
      toast.error("Failed to create reply");
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: queryKey.value });
      }, 1000);
    },
  });

  const createReply = async (content: string) => {
    if (!content.trim()) return;

    await replyMutation.mutateAsync(content.trim());
  };

  return {
    createReply,
    isPending: computed(() => replyMutation.isPending.value),
  };
}
