<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import CommentItem from "./CommentItem.vue";
import { ROUTES } from "~~/utils/routes";
import { authClient } from "~~/utils/auth-client";
import type { Comment } from "~/types/comment";
import { FIVE_MINUTES } from "~~/utils/constants";

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
const queryClient = useQueryClient();
const session = authClient.useSession();
const queryKey = ["comments", props.projectId, props.taskId, sortOrder.value];

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

const createCommentMutation = useMutation({
  mutationFn: async (content: string) => {
    const response = await $fetch<Comment>(ROUTES.API.TASK_COMMENTS(props.projectId, props.taskId), {
      method: "POST",
      body: { content },
      credentials: "include",
    });

    return response;
  },
  onMutate: async (content) => {
    await queryClient.cancelQueries({
      queryKey,
    });

    const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

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
      taskId: props.taskId,
      userId: userId,
      parentId: null,
      replies: [],
    };

    queryClient.setQueryData<Comment[]>(queryKey, (old = []) => {
      const newComments = [...old, optimisticComment];

      return newComments.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
      });
    });

    return { previousComments };
  },
  onError: (_err, _variables, context) => {
    if (context?.previousComments) {
      queryClient.setQueryData(queryKey, context.previousComments);
    }
    alert("Failed to create comment");
  },
  onSuccess: () => {
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey,
      });
    }, 1000);
  },
});

const handleSubmit = async () => {
  if (!newComment.value.trim()) return;

  const content = newComment.value.trim();
  newComment.value = "";

  try {
    await createCommentMutation.mutateAsync(content);
  } catch (error) {
    console.error("Failed to create comment:", error);
  }
};

const commentsList = computed(() => comments.value || []);
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
          <Button :disabled="!newComment.trim() || createCommentMutation.isPending.value" @click="handleSubmit">
            {{ createCommentMutation.isPending.value ? "Posting..." : "Post Comment" }}
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-4 text-gray-500">Loading comments...</div>
      <div v-else-if="commentsList.length === 0" class="text-center py-4 text-gray-500">
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
    </CardContent>
  </Card>
</template>
