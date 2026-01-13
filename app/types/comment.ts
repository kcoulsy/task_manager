import type { findAllCommentsByTask } from "~~/server/services/comment.service";

// Get the return type directly from the service function
export type Comment = Awaited<ReturnType<typeof findAllCommentsByTask>>[number];

// Transformed reaction type (as returned by the API)
export type CommentReaction = Comment["reactions"][number];
