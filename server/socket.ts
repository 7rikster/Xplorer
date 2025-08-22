import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./src/utils/index.js";
import dotenv from "dotenv";

dotenv.config();

interface SetupSocket {
  (server: HttpServer): void;
}

const setupSocket: SetupSocket = (server: HttpServer): void => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map<string, string>();
  

  interface DisconnectFunction {
    (socket: import("socket.io").Socket): void;
  }

  const disconnect: DisconnectFunction = (
    socket: import("socket.io").Socket
  ): void => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendGroupMessage = async (data: {
    sender: string;
    content: string;
    groupId: string;
    url: string[];
    fileType: string;
  }) => {
    const { sender, content, groupId, url, fileType } = data;

    const message = await prisma.message.create({
      data: {
        sender: { connect: { id: sender } },
        content,
        group: { connect: { id: groupId } },
      },
    });
    if (!message) {
      console.error("Failed to create message in database");
      return;
    }
    if (fileType !== "text" && url.length > 0) {
      await prisma.attachment.createMany({
        data: url.map((fileUrl) => ({
          messageId: message.id,
          url: fileUrl,
          fileType,
        })),
      });
    }
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: true,
        admin: true,
      },
    });
    await prisma.group.update({
      where: { id: groupId },
      data: {
        updatedAt: new Date(),
      },
    });
    const finalMessage = await prisma.message.findUnique({
      where: { id: message.id },
      include: {
        sender: true,
        attachments: true,
      },
    });

    if (group && group.members) {
      group.members.forEach((member) => {
        if (member.userId === group.admin.id) return;
        const memberSocketId = userSocketMap.get(member.userId.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-group-message", finalMessage);
        }
      });
      const adminSocketId = userSocketMap.get(group.admin.id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-group-message", finalMessage);
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }
    socket.on("send-group-message", sendGroupMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
  console.log(userSocketMap)
};

export default setupSocket;
