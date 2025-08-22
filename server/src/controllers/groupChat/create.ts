import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { name, members, photoUrl } = req.body;

    if (
      !name ||
      !members ||
      !Array.isArray(members) ||
      members.length === 0 ||
      !photoUrl
    ) {
      return next(
        Errors.GroupChat.badRequest("Name, members, and photoUrl are required")
      );
    }

    const firebaseId = req.firebaseId;
    const admin = await prisma.user.findUnique({
      where: { firebaseId },
    });

    if (!admin) {
      return next(Errors.GroupChat.adminNotFound);
    }

    const validMembers = await prisma.user.findMany({
      where: {
        id: {
          in: members,
        },
      },
    });

    if (validMembers.length !== members.length) {
      return next(
        Errors.GroupChat.badRequest("Some members are not Valid users")
      );
    }

    const group = await prisma.group.create({
      data: {
        name: name,
        admin: {
          connect: { id: admin.id },
        },
        photoUrl: photoUrl,
      },
    });

    if (!group) {
      return next(Errors.GroupChat.badRequest("Failed to create group chat"));
    }
    await prisma.groupMember.createMany({
      data: validMembers.map((user) => ({
        userId: user.id,
        groupId: group.id,
      })),
    });
    await prisma.groupMember.create({
      data: { 
        userId: admin.id,
        groupId: group.id,
      },
    });

    const groupWithMembers = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: true,
        admin: true,
      },
    });

    return res.status(201).json({
      message: "Group chat created successfully",
      data: groupWithMembers,
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    return next(Errors.GroupChat.badRequest("Failed to create group chat"));
  }
};

const getUserGroups: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const firebaseId = req.firebaseId;
    const user = await prisma.user.findUnique({
      where: { firebaseId },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    const userGroups = await prisma.groupMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        group: true,
      },
    });

    if (!userGroups) {
      return next(
        Errors.GroupChat.badRequest("Failed to retrieve user groups")
      );
    }
    const sortedGroups = userGroups.sort(
      (a, b) =>
        new Date(b.group.updatedAt).getTime() -
        new Date(a.group.updatedAt).getTime()
    );

    return res.status(201).json({
      message: "Groups retrieved successfully",
      data: sortedGroups,
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    return next(Errors.GroupChat.badRequest("Failed to create group chat"));
  }
};

export { Create, getUserGroups };
