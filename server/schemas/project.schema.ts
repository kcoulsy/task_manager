import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").trim(),
  description: z.string().trim().optional().nullable(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").trim(),
  description: z.string().trim().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
