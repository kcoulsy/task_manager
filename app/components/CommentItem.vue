<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import { Plus } from "lucide-vue-next";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Comment } from "~/types/comment";
import { formatHumanRelativeDate } from "~~/utils/date-helpers";
import { EMOJI_REACTION_OPTIONS } from "~~/utils/constants";

const props = defineProps<{
  comment: Comment;
  projectId: string;
  taskId: string;
  parentListSortOrder: "asc" | "desc";
}>();

const queryClient = useQueryClient();

const queryKey = ["comments", props.projectId, props.taskId, props.parentListSortOrder];

const reactionMutation = useMutation({
  mutationFn: async (emoji: string) => {
    const response = await $fetch<{ action: "added" | "removed" }>(
      ROUTES.API.COMMENT_REACTIONS(props.projectId, props.taskId, props.comment.id),
      {
        method: "POST",
        body: { emoji },
        credentials: "include",
      },
    );
    return { emoji, action: response.action };
  },
  onMutate: async (emoji) => {
    await queryClient.cancelQueries({ queryKey });
    const previousComments = queryClient.getQueryData<(typeof props.comment)[]>(queryKey);

    queryClient.setQueryData<(typeof props.comment)[]>(queryKey, (old = []) => {
      return old.map((comment) => {
        if (comment.id !== props.comment.id) return comment;

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
            reactions: {
              ...comment.reactions,
              [emoji]: {
                emoji,
                count: (existingReaction?.count ?? 0) - 1,
                userReacted: false,
              },
            },
          };
        }

        if (!wasReacted && existingReaction) {
          return {
            ...comment,
            reactions: {
              ...comment.reactions,
              [emoji]: {
                emoji,
                count: (existingReaction?.count ?? 0) + 1,
                userReacted: true,
              },
            },
          };
        }

        return {
          ...comment,
          reactions: [...comment.reactions, { emoji, count: 1, userReacted: true }],
        };
      });
    });

    return { previousComments };
  },
  onError: (_err, _variables, context) => {
    if (context?.previousComments) {
      queryClient.setQueryData(queryKey, context.previousComments);
    }
    console.error("Failed to toggle reaction:", _err);
  },
  onSuccess: () => {
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey,
      });
    }, 500);
  },
});

const handleReaction = async (emoji: string) => {
  try {
    await reactionMutation.mutateAsync(emoji);
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
  }
};

const hasUserReacted = (emoji: string): boolean => {
  const reaction = props.comment.reactions.find((r) => r.emoji === emoji);
  return reaction?.userReacted ?? false;
};
</script>

<template>
  <div class="border-b border-gray-200 pb-4 last:border-b-0">
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-sm">{{ comment.user.name }}</span>
          <span class="text-xs text-gray-500">{{ formatHumanRelativeDate(comment.createdAt) }}</span>
        </div>
        <p class="text-gray-700 text-sm whitespace-pre-wrap mb-2">{{ comment.content }}</p>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="reaction in comment.reactions"
            :key="reaction.emoji"
            class="inline-flex items-center gap-1 px-2 cursor-pointer py-1 rounded-full text-xs border transition-colors"
            :class="
              reaction.userReacted
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            "
            @click="handleReaction(reaction.emoji)"
          >
            <span>{{ reaction.emoji }}</span>
            <span>{{ reaction.count }}</span>
          </button>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" size="sm" class="h-7 text-xs cursor-pointer"> <Plus class="h-4 w-4" /> </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-2">
              <div class="flex gap-2">
                <button
                  v-for="emoji in EMOJI_REACTION_OPTIONS"
                  :key="emoji"
                  class="text-xl hover:scale-125 transition-all p-1 rounded"
                  :class="hasUserReacted(emoji) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'"
                  @click="handleReaction(emoji)"
                >
                  {{ emoji }}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  </div>
</template>
