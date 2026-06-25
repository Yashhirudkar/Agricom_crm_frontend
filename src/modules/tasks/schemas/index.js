import { z } from "zod";

/**
 * Zod Schemas for Form Validation
 * Mapped to Backend DTO validation rules
 */

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be under 255 characters"),
  description: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  estimatedMinutes: z.number().int().nonnegative("Must be a positive number").optional().nullable(),
  statusId: z.number().int().positive("Status is required").optional().nullable(),
  priorityId: z.number().int().positive().optional().nullable(),
  parentTaskId: z.number().int().positive().optional().nullable(),
  assigneeIds: z.array(z.number()).optional(),
  watcherIds: z.array(z.number()).optional(),
  labelIds: z.array(z.number()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  version: z.number().int().nonnegative("Version mismatch"),
  completionPercentage: z.number().min(0).max(100).optional(),
});

export const createChecklistSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(10000),
  parentCommentId: z.number().int().positive().optional(),
});

export const createDependencySchema = z.object({
  dependsOnTaskId: z.number().int().positive("Task selection is required"),
  dependencyType: z.enum(["BLOCKED_BY", "RELATES_TO", "DUPLICATES"]),
});
