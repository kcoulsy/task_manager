<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import CommentItem from "./CommentItem.vue";
import { ROUTES } from "~~/utils/routes";
import type { Comment } from "~/types/comment";
import { FIVE_MINUTES } from "~~/utils/constants";
import { useCreateComment } from "~/composables/useCreateComment";

const props = withDefaults(
  defineProps<{
    taskId: string;
    projectId: string;
    initialComments?: Comment[];
  }>(),
  {
    initialComments: undefined,
  },
);

const sortOrder = ref<"asc" | "desc">("desc");
const newComment = ref("");
const queryKey = computed(() => ["comments", props.projectId, props.taskId, sortOrder.value]);

const { data: comments, isLoading } = useQuery({
  queryKey,
  queryFn: async () => {
    const data = await $fetch<Comment[]>(ROUTES.API.TASK_COMMENTS(props.projectId, props.taskId), {
      query: { sort: sortOrder.value },
      credentials: "include",
    });
    return data || [];
  },
  initialData: () => props.initialComments,
  staleTime: FIVE_MINUTES,
});

const { createComment, isPending } = useCreateComment(props.projectId, props.taskId, sortOrder);

const handleSubmit = async () => {
  if (!newComment.value.trim()) return;

  const content = newComment.value.trim();
  newComment.value = "";

  try {
    await createComment(content);
  } catch (error) {
    console.error("Failed to create comment:", error);
  }
};

const commentsList = computed(() => comments.value || []);
</script>

<template>
  <div class="comment-section border-t border-gray-200 pt-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wide">
        Comments
        <span v-if="!isLoading" class="text-gray-400 ml-2">({{ commentsList.length }})</span>
      </h2>
      <Select v-model="sortOrder">
        <SelectTrigger class="w-[160px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest First</SelectItem>
          <SelectItem value="asc">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- New Comment Input -->
    <div class="space-y-3 mb-6">
      <textarea
        v-model="newComment"
        placeholder="Add a comment..."
        class="w-full min-h-[80px] px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        @keydown.ctrl.enter="handleSubmit"
        @keydown.meta.enter="handleSubmit"
      />
      <div class="flex justify-end">
        <Button :disabled="!newComment.trim() || isPending" @click="handleSubmit">
          {{ isPending ? "Posting..." : "Post Comment" }}
        </Button>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="isLoading" class="text-center py-8 text-gray-500">Loading comments...</div>
    <div v-else-if="commentsList.length === 0" class="text-center py-8 text-gray-400 italic">
      No comments yet. Be the first to comment!
    </div>
    <div v-else class="space-y-4">
      <CommentItem
        v-for="comment in commentsList"
        :key="comment.id"
        :comment="comment"
        :project-id="projectId"
        :task-id="taskId"
        :parent-list-sort-order="sortOrder"
      />
    </div>
  </div>
</template>
