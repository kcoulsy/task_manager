<script setup lang="ts">
import { ref, computed } from "vue";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Plus, Reply } from "lucide-vue-next";
import type { Comment } from "~/types/comment";
import { formatHumanRelativeDate } from "~~/utils/date-helpers";
import { EMOJI_REACTION_OPTIONS } from "~~/utils/constants";
import { useCreateReply } from "~/composables/useCreateReply";
import { useReaction } from "~/composables/useReaction";

const props = defineProps<{
  comment: Comment;
  projectId: string;
  taskId: string;
  parentListSortOrder: "asc" | "desc";
}>();

const showReplyInput = ref(false);
const replyContent = ref("");

const { toggleReaction } = useReaction(props.projectId, props.taskId, props.comment.id, props.parentListSortOrder);
const { createReply, isPending: isReplyPending } = useCreateReply(
  props.projectId,
  props.taskId,
  props.comment.id,
  props.parentListSortOrder,
);

const handleReaction = async (emoji: string) => {
  try {
    await toggleReaction(emoji);
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
  }
};

const hasUserReacted = (emoji: string): boolean => {
  const reaction = props.comment.reactions.find((r) => r.emoji === emoji);
  return reaction?.userReacted ?? false;
};

const handleReply = async () => {
  if (!replyContent.value.trim()) return;

  const content = replyContent.value.trim();
  replyContent.value = "";
  showReplyInput.value = false;

  try {
    await createReply(content);
  } catch {
    // Reopen reply input on error so user can try again
    showReplyInput.value = true;
    replyContent.value = content;
  }
};

const toggleReplyInput = () => {
  showReplyInput.value = !showReplyInput.value;
  if (!showReplyInput.value) {
    replyContent.value = "";
  }
};

const isTopLevelComment = computed(() => !props.comment.parentId);
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

          <Button
            v-if="isTopLevelComment"
            variant="ghost"
            size="sm"
            class="h-7 text-xs cursor-pointer text-gray-600 hover:text-gray-900"
            @click="toggleReplyInput"
          >
            <Reply class="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>
        </div>

        <div v-if="showReplyInput" class="mt-3 ml-4 border-l-2 border-gray-200 pl-4">
          <textarea
            v-model="replyContent"
            placeholder="Write a reply..."
            class="w-full min-h-[60px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            @keydown.ctrl.enter="handleReply"
            @keydown.meta.enter="handleReply"
          />
          <div class="flex justify-end gap-2 mt-2">
            <Button variant="ghost" size="sm" @click="toggleReplyInput">Cancel</Button>
            <Button :disabled="!replyContent.trim() || isReplyPending" size="sm" @click="handleReply">
              {{ isReplyPending ? "Posting..." : "Post Reply" }}
            </Button>
          </div>
        </div>

        <div
          v-if="comment.replies && comment.replies.length > 0"
          class="mt-4 ml-4 border-l-2 border-gray-200 pl-4 space-y-3"
        >
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply as Comment"
            :project-id="projectId"
            :task-id="taskId"
            :parent-list-sort-order="parentListSortOrder"
          />
        </div>
      </div>
    </div>
  </div>
</template>
