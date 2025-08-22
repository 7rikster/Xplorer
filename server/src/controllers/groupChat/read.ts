import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const getGroupMessages: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return next(Errors.GroupChat.badRequest("Group ID is required"));
    }
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      return next(Errors.GroupChat.groupChatNotFound);
    }

    const messages = await prisma.message.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        sender: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!messages || messages.length === 0) {
      return res.status(200).json({
        message: "No messages found for this group",
        data: [],
      });
    }
    return res.status(200).json({
      message: "Group messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    return next(Errors.GroupChat.badRequest("Failed to create group chat"));
  }
};

export default getGroupMessages;
