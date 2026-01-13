<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import CommentItem from "./CommentItem.vue";
import { ROUTES } from "~~/utils/routes";

const props = defineProps<{
  taskId: string;
  projectId: string;
}>();

type Comment = {
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

const sortOrder = ref<"asc" | "desc">("desc");
const newComment = ref("");
const isSubmitting = ref(false);

const comments = ref<Comment[]>([]);
const isLoading = ref(false);

const fetchComments = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch<Comment[]>(ROUTES.API.TASK_COMMENTS(props.projectId, props.taskId), {
      query: { sort: sortOrder.value },
      credentials: "include",
    });
    comments.value = data || [];
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    comments.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!newComment.value.trim()) return;

  isSubmitting.value = true;
  try {
    await $fetch(ROUTES.API.TASK_COMMENTS(props.projectId, props.taskId), {
      method: "POST",
      body: { content: newComment.value.trim() },
      credentials: "include",
    });
    newComment.value = "";
    await fetchComments();
  } catch (error) {
    console.error("Failed to create comment:", error);
    alert("Failed to create comment");
  } finally {
    isSubmitting.value = false;
  }
};

watch(sortOrder, () => {
  fetchComments();
});

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Comments</CardTitle>
        <Select v-model="sortOrder">
          <SelectTrigger class="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          @keydown.ctrl.enter="handleSubmit"
          @keydown.meta.enter="handleSubmit"
        />
        <div class="flex justify-end">
          <Button @click="handleSubmit" :disabled="!newComment.trim() || isSubmitting">
            {{ isSubmitting ? "Posting..." : "Post Comment" }}
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-4 text-gray-500">Loading comments...</div>
      <div v-else-if="comments.length === 0" class="text-center py-4 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
      <div v-else class="space-y-4">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :project-id="projectId"
          :task-id="taskId"
          :on-reaction-change="fetchComments"
        />
      </div>
    </CardContent>
  </Card>
</template>
