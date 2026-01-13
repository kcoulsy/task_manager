import { prisma } from "~~/utils/db";
import { notFoundError } from "~~/server/utils/errors";

async function verifyCommentAccess(commentId: string, userId: string) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
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

  const task = await prisma.task.findFirst({
    where: {
      id: comment.taskId,
      userId,
    },
  });

  if (!task) {
    throw notFoundError("Task not found");
  }

  return comment;
}

export async function toggleReaction(commentId: string, userId: string, emoji: string) {
  await verifyCommentAccess(commentId, userId);

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      commentId_userId_emoji: {
        commentId,
        userId,
        emoji,
      },
    },
  });

  if (existingReaction) {
    await prisma.reaction.delete({
      where: {
        id: existingReaction.id,
      },
    });
    return { action: "removed" as const };
  }
  await prisma.reaction.create({
    data: {
      id: crypto.randomUUID(),
      emoji,
      commentId,
      userId,
    },
  });
  return { action: "added" as const };
}

export async function getReactionsByComment(commentId: string, userId: string) {
  await verifyCommentAccess(commentId, userId);

  const reactions = await prisma.reaction.findMany({
    where: {
      commentId,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

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
