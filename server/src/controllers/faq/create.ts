import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;
  if (!auth) {
    return next(Errors.Destination.badRequest("Auth token is missing"));
  }
  let { question, answer, tripId } = req.body;

    if (!question || !answer || !tripId) {
        return next(Errors.Faq.badRequest);
    }

    question = question.trim();
    answer = answer.trim();
    tripId = tripId.trim();
    const faqExists = await prisma.faq.count({
        where: {
            question: question,
            tripId: tripId
        },
    });
    if (faqExists > 0) {
        return next(Errors.Faq.faqAlreadyExists);
    }
    try {
        const faq = await prisma.faq.create({
          data: {
            question,
            answer,
            tripId
          },
        });
        res.status(200).json({
          message: "Faq created successfully",
          data: faq,
        });
      } catch (error) {
        return next(Errors.System.serverError);
      }

}

export default Create;