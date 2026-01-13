<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import { Plus } from "lucide-vue-next";

const props = defineProps<{
  comment: {
    id: string;
    content: string;
    createdAt: Date | string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    reactions: Array<{
      emoji: string;
      count: number;
      userReacted: boolean;
    }>;
  };
  projectId: string;
  taskId: string;
  onReactionChange?: () => void;
}>();

const { formatDate } = useTaskHelpers();

const EMOJI_OPTIONS = ["👍", "👎", "❤️", "😂", "😮", "😢", "🎉", "🔥"];

const handleReaction = async (emoji: string) => {
  try {
    await $fetch(ROUTES.API.COMMENT_REACTIONS(props.projectId, props.taskId, props.comment.id), {
      method: "POST",
      body: { emoji },
      credentials: "include",
    });
    props.onReactionChange?.();
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
  }
};

const formatCommentDate = (date: string | Date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date, { year: "numeric", month: "short", day: "numeric" }) || "";
};
</script>

<template>
  <div class="border-b border-gray-200 pb-4 last:border-b-0">
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-sm">{{ comment.user.name }}</span>
          <span class="text-xs text-gray-500">{{ formatCommentDate(comment.createdAt) }}</span>
        </div>
        <p class="text-gray-700 text-sm whitespace-pre-wrap mb-2">{{ comment.content }}</p>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="reaction in comment.reactions"
            :key="reaction.emoji"
            @click="handleReaction(reaction.emoji)"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors"
            :class="
              reaction.userReacted
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            "
          >
            <span>{{ reaction.emoji }}</span>
            <span>{{ reaction.count }}</span>
          </button>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" size="sm" class="h-7 text-xs"> <Plus class="h-4 w-4" /> </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-2">
              <div class="flex gap-2">
                <button
                  v-for="emoji in EMOJI_OPTIONS"
                  :key="emoji"
                  @click="handleReaction(emoji)"
                  class="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100"
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
