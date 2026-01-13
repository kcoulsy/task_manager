import { computed, type MaybeRefOrGetter } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ROUTES } from "~~/utils/routes";
import type { Comment } from "~/types/comment";
import { toValue } from "vue";

export function useReaction(
  projectId: string,
  taskId: string,
  commentId: string,
  sortOrder: MaybeRefOrGetter<"asc" | "desc">,
) {
  const queryClient = useQueryClient();
  const queryKey = computed(() => ["comments", projectId, taskId, toValue(sortOrder)]);

  const reactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      const response = await $fetch<{ action: "added" | "removed" }>(
        ROUTES.API.COMMENT_REACTIONS(projectId, taskId, commentId),
        {
          method: "POST",
          body: { emoji },
          credentials: "include",
        },
      );
      return { emoji, action: response.action };
    },
    onMutate: async (emoji) => {
      await queryClient.cancelQueries({ queryKey: queryKey.value });
      const previousComments = queryClient.getQueryData<Comment[]>(queryKey.value);

      const updateCommentReactions = (comment: Comment): Comment => {
        if (comment.id !== commentId) {
          // If this comment has replies, update them recursively
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => updateCommentReactions(reply as Comment)),
            } as Comment;
          }
          return comment;
        }

        const reactionIndex = comment.reactions.findIndex((r) => r.emoji === emoji);
        const existingReaction = reactionIndex !== -1 ? comment.reactions[reactionIndex] : null;
        const wasReacted = existingReaction?.userReacted ?? false;

        if (wasReacted && existingReaction && existingReaction.count === 1) {
          return {
            ...comment,
            reactions: comment.reactions.filter((_, i) => i !== reactionIndex),
          };
        }

        if (wasReacted && existingReaction && existingReaction.count > 1) {
          return {
            ...comment,
            reactions: comment.reactions.map((r, i) =>
              i === reactionIndex
                ? {
                    emoji,
                    count: (existingReaction?.count ?? 0) - 1,
                    userReacted: false,
                  }
                : r,
            ),
          };
        }

        if (!wasReacted && existingReaction) {
          return {
            ...comment,
            reactions: comment.reactions.map((r, i) =>
              i === reactionIndex
                ? {
                    emoji,
                    count: (existingReaction?.count ?? 0) + 1,
                    userReacted: true,
                  }
                : r,
            ),
          };
        }

        return {
          ...comment,
          reactions: [...comment.reactions, { emoji, count: 1, userReacted: true }],
        };
      };

      queryClient.setQueryData(queryKey.value, (old: Comment[] | undefined) => {
        const comments = [...(old || [])];
        return comments.map((comment: Comment) => updateCommentReactions(comment));
      });

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey.value, context.previousComments);
      }
      console.error("Failed to toggle reaction:", _err);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: queryKey.value,
        });
      }, 500);
    },
  });

  const toggleReaction = async (emoji: string) => {
    await reactionMutation.mutateAsync(emoji);
  };

  return {
    toggleReaction,
    isPending: computed(() => reactionMutation.isPending.value),
  };
}
