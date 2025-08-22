import * as Interfaces from "../../interfaces/index.js";
import * as Errors from "../../globals/errors/index.js";
import { prisma } from "../../utils/index.js";
import { getDestinationAttractions } from "../../utils/destinationAttractions.js";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  let { placeId, city, country } = req.body;

  if (!placeId || !city || !country) {
    console.log("Invalid request body:", req.body);
    return next(Errors.Destination.badRequest);
  }

  placeId = placeId.trim();
  city = city.trim();
  country = country.trim();

  const destinationExists = await prisma.destinationDetails.count({
    where: {
      placeId: placeId,
    },
  });

  if (destinationExists > 0) {
    const destinationDetails = await prisma.destinationDetails.findUnique({
      where: {
        placeId: placeId,
      },
    });
    return res.status(200).json({
      message: "Destination details fetched successfully",
      data: destinationDetails,
    });
  }

  try {
    const attractions = await getDestinationAttractions({
      city,
      country,
    });
    const destination = await prisma.destinationDetails.create({
      data: {
        placeId,
        city,
        country,
        imageUrls: attractions.imageUrls,
        attractions: JSON.parse(JSON.stringify(attractions.attractions)),
      },
    });

    res.status(200).json({
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error) {
    return next(Errors.System.serverError);
  }
};

export default Create;
