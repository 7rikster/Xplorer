import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const firebaseId = req.firebaseId;
  const user = await prisma.user.findUnique({
    where: {
      firebaseId: firebaseId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return next(Errors.User.userNotFound);
  }
  let { title, amount } = req.body;

  if (!title || !amount) {
    return next(Errors.Review.badRequest);
  }

  if (typeof amount !== "number" || amount < 1) {
    return next(
      Errors.Review.badRequest("Amount must be a number greater than 0")
    );
  }
  title = title.trim();
  amount = Number(amount);
  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        user: {
          connect: { id: user.id },
        },
      },
    });
    res.status(200).json({
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    return next(Errors.System.serverError);
  }
};

export default Create;
