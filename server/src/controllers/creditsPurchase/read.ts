import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const ReadUserCreditPurchases: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  const firebaseId = req?.firebaseId;
  const user = await prisma.user.findUnique({
    where: { firebaseId: firebaseId },
    select: {
      id: true,
    },
  });

  if (!user) {
    return next(Errors.User.userNotFound);
  }
  try {
    const purchases = await prisma.creditsPurchase.findMany({
      where: { userId: user.id, isCompleted: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      message: "Credit purchase Retrieved Successfully",
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching credit purchase:", error);
    return next(
      Errors.System.serverError("Failed to Retrieve credit purchase From Database")
    );
  }
};




export default ReadUserCreditPurchases;
