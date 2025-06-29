import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";

const ReadUserExpenses: Interfaces.Controllers.Async = async (
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
    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      message: "Expenses Retrieved Successfully",
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return next(
      Errors.System.serverError("Failed to Retrieve expenses From Database")
    );
  }
};

export default ReadUserExpenses;
