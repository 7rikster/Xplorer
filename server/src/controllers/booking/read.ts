import * as Interfaces from "../../interfaces";
import * as Errors from "../../globals/errors";
import { prisma } from "../../utils";


const GetUserTripBookings: Interfaces.Controllers.Async = async (req, res, next) => {
    const firebaseId = req.firebaseId;
    const user = await prisma.user.findUnique({
        where: {  firebaseId },
    })
    if(!user){
        return next(Errors.User.userNotFound);
    }
  try {
    const bookings = await prisma.tripBooking.findMany({
      where: { userId: user.id, isCompleted: true },
      include:{
        trip: true
      }
    });
    return res.status(200).json({
        message: "User Trip Bookings Retrieved Successfully",
        data: bookings,
    })
    
  } catch (error) {
    console.error("Error fetching user trip bookings:", error);
    return next(Errors.System.serverError("Failed to fetch user trip bookings from Database"));
  }
};

export default GetUserTripBookings;
