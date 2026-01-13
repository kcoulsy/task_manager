import { prisma } from "~~/utils/db";
import { notFoundError } from "~~/server/utils/errors";
import type { CreateCommentInput, UpdateCommentInput } from "~~/server/schemas/comment.schema";

async function verifyTaskAccess(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw notFoundError("Task not found");
  }

  return task;
}

export function transformReactions(
  reactions: Array<{ emoji: string; userId: string }>,
  userId: string,
): Array<{ emoji: string; count: number; userReacted: boolean }> {
  const reactionGroups: Record<string, { emoji: string; count: number; userReacted: boolean }> = {};

  reactions.forEach((reaction) => {
    if (!reactionGroups[reaction.emoji]) {
      reactionGroups[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        userReacted: false,
      };
    }
    const group = reactionGroups[reaction.emoji]!;
    group.count++;
    if (reaction.userId === userId) {
      group.userReacted = true;
    }
  });

  return Object.values(reactionGroups);
}

export async function findAllCommentsByTask(taskId: string, userId: string, sortOrder: "asc" | "desc" = "desc") {
  await verifyTaskAccess(taskId, userId);

  const allComments = await prisma.comment.findMany({
    where: {
      taskId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const topLevelComments = allComments.filter((comment) => comment.parentId === null || comment.parentId === undefined);

  topLevelComments.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return topLevelComments.map((comment) => {
    return {
      ...comment,
      reactions: transformReactions(
        comment.reactions.map((r) => ({ emoji: r.emoji, userId: r.userId })),
        userId,
      ),
    };
  });
}

export async function createComment(taskId: string, userId: string, data: CreateCommentInput) {
  await verifyTaskAccess(taskId, userId);

  const comment = await prisma.comment.create({
    data: {
      id: crypto.randomUUID(),
      content: data.content,
      taskId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: {
        select: {
          emoji: true,
          userId: true,
        },
      },
    },
  });

  return {
    ...comment,
    reactions: transformReactions(comment.reactions, userId),
  };
}

export async function findCommentById(commentId: string, userId: string) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId,
    },
    include: {
      task: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!comment) {
    throw notFoundError("Comment not found");
  }

  return comment;
}

export async function updateComment(commentId: string, userId: string, data: UpdateCommentInput) {
  await findCommentById(commentId, userId);

  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...(data.content !== undefined && { content: data.content }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reactions: true,
    },
  });
}

export async function deleteComment(commentId: string, userId: string) {
  await findCommentById(commentId, userId);

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return { success: true };
}
