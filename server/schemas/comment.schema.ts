import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").trim(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").trim().optional(),
});

export type CreateCommentInput = {
  content: string;
};

export type UpdateCommentInput = {
  content?: string;
};
