"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

import Loading from "@/app/loading";
import TourPlanTable from "@/components/tourPlanTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/authContext";
import { auth } from "@/lib/firebase/firebaseConfig";
import getPlacePhoto from "@/lib/placePhoto";
import { getFirstWord, parsePriceString, parseTripData } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Delete,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import BookingWidget from "@/components/booking-widget";
import { useRouter } from "next/navigation";

type Params = {
  tripId: string;
};

interface Review {
  rating: number;
  comment: string;
  imageUrl?: string;
  publicId?: string;
}

function ClientTripPage({ params }: { params: Promise<Params> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const [hotelPhoto, setHotelPhoto] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [reviewData, setReviewData] = useState<Review>({
    comment: "",
    rating: 0,
    imageUrl: "",
    publicId: "",
  });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isEditReviewDialogOpen, setIsEditReviewDialogOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [addReviewLoading, setAddReviewLoading] = useState(false);
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);
  const [editReviewLoading, setEditReviewLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const router = useRouter();

  const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] =
    useState(false);

  const { user: currentUser, loading: authLoading } = useUser();
  const [user] = useAuthState(auth);

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    location,
    accommodation,
    faqs,
    reviews,
  } = trip || {};

  const pillItems = [
    { text: travelStyle, bg: "bg-blue-100 text-blue-600" },
    { text: groupType, bg: "bg-green-100 text-green-600" },
    { text: budget, bg: "bg-yellow-100 text-yellow-600" },
    { text: interests, bg: "bg-red-100 text-red-600" },
  ];

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  async function handleReviewImageUploadChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedImage = event.target.files ? event.target.files[0] : null;
    if (selectedImage) {
      setIsImageUploading(true);
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        const token = await user?.getIdToken();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/media/upload`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setReviewData((prev) => ({
            ...prev,
            imageUrl: response.data.data.secure_url,
            publicId: response.data.data.public_id,
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setIsImageUploading(false);
    }
  }

  async function handleAddReview() {
    if (!user) {
      toast.error("You must be logged in to add a review.");
      return;
    }
    setAddReviewLoading(true);
    const token = await user.getIdToken();
    if (!reviewData.comment || reviewData.comment === "") {
      toast.error("Please enter a comment for the review.");
      setAddReviewLoading(false);
      return;
    }
    console.log("Review data: ", reviewData);
    if (
      !reviewData.rating ||
      reviewData.rating === 0 ||
      reviewData.rating < 1 ||
      reviewData.rating > 5
    ) {
      setAddReviewLoading(false);
      toast.error("Please enter a rating between 1 and 5 for the review.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/review/add`,
        {
          comment: reviewData.comment,
          rating: reviewData.rating,
          imageUrl: reviewData.imageUrl,
          publicId: reviewData.publicId,
          userDisplayName: currentUser?.name,
          userPhoto: currentUser?.photoUrl,
          userId: currentUser?.id,
          tripId: tripId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toast.success("Review added successfully!");
      } else {
        toast.error("Failed to add review.");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.status === 409
      ) {
        toast.error("You have already added a review for this trip.");
      }
    }
    setAddReviewLoading(false);
    setReviewData({
      comment: "",
      rating: 0,
      imageUrl: "",
      publicId: "",
    });
    fetchTripDetails();
    isReviewDialogOpen && setIsReviewDialogOpen(false);
  }

  async function handleEditReview(reviewId: string) {
    if (!user) {
      toast.error("You must be logged in to edit a review.");
      return;
    }
    setEditReviewLoading(true);
    const token = await user.getIdToken();
    if (!reviewData.comment || reviewData.comment === "") {
      toast.error("Please enter a comment for the review.");
      setEditReviewLoading(false);
      return;
    }
    if (
      !reviewData.rating ||
      reviewData.rating === 0 ||
      reviewData.rating < 1 ||
      reviewData.rating > 5
    ) {
      setEditReviewLoading(false);
      toast.error("Please enter a rating between 1 and 5 for the review.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/review/update/${reviewId}`,
        {
          comment: reviewData.comment,
          rating: reviewData.rating,
          userId: currentUser?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toast.success("Review updated successfully!");
        fetchTripDetails();
      } else {
        toast.error("Failed to update review.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review.");
    } finally {
      setEditReviewLoading(false);
      setIsEditReviewDialogOpen(false);
    }
  }

  async function handleDeleteReview(reviewId: string, publicId?: string) {
    if (!user) {
      toast.error("You must be logged in to delete a review.");
      return;
    }
    setDeleteReviewLoading(true);
    const token = await user.getIdToken();
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/review/delete/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (publicId && publicId !== "") {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/media/delete/${publicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Image deleted response: ", res.data);
      }
      if (response.data) {
        toast.success("Review deleted successfully!");
        fetchTripDetails();
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    } finally {
      setDeleteReviewLoading(false);
      setIsDeleteReviewDialogOpen(false);
    }
  }

  const fetchTripDetails = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/get/${tripId}`
      );
      // console.log("Trip details: ",response.data.data);
      const parsedTrip = parseTripData(response.data.data.tripDetail);
      if (parsedTrip && parsedTrip.name) {
        const sortedReviews = [...(response.data.data.reviews || [])].sort(
          (a, b) => {
            if (a.userId === currentUser?.id) return -1;
            if (b.userId === currentUser?.id) return 1;
            return 0;
          }
        );
        setTrip({
          // id: response.data.data.id,
          ...parsedTrip,
          imageUrls: response.data.data.imageUrls
            ? response.data.data.imageUrls
            : [],
          faqs: response.data.data.faqs || [],
          reviews: sortedReviews,
        });
      } else {
        setTrip(undefined);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  function getEndDate(startDate: string, totalDays: number): string {
    const start = new Date(startDate);
    start.setDate(start.getDate() + totalDays - 1);
    return start.toISOString();
  }

  async function handleBooking() {
    const isoEndDate = getEndDate(startDate?.toISOString() || "", duration!);
    const isoDate = startDate?.toISOString();
    if (!isoDate) {
      toast.error("Please select a start date for the trip.");
      return;
    }
    const token = await user?.getIdToken();
    if (!token) {
      toast.error("You must be logged in to book a trip.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tripBooking/create`,
        {
          bookingId: tripId,
          bookingType: "trip",
          userId: currentUser?.id,
          details: {
            startDate: isoDate,
            endDate: isoEndDate,
            adults,
            children: kids,
            location: `${location?.city}, ${location?.country}`,
          },
          totalAmount: adults * parsePriceString(estimatedPrice || "1000"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.client_secret) {
        router.push(`/checkout?client_secret=${response.data.client_secret}`);
      } else {
        toast.error("Failed to book trip.");
      }
    } catch (error) {
      console.error("Error booking trip:", error);
      toast.error("Failed to book trip.");
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const sortedReviews = [...(trip?.reviews || [])].sort((a, b) => {
        if (a.userId === currentUser?.id) return -1;
        if (b.userId === currentUser?.id) return 1;
        return 0;
      });

      setTrip((prevTrip) => {
        if (!prevTrip) return prevTrip;
        return {
          ...prevTrip,
          reviews: sortedReviews || [],
        };
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    void fetchTripDetails();
  }, [params]);

  useEffect(() => {
    if (accommodation) {
      const fetchPhoto = async () => {
        const url = await getPlacePhoto({
          query: accommodation.hotelName,
          latitude: location?.coordinates[0] || 0,
          longitude: location?.coordinates[1] || 0,
        });
        setHotelPhoto(url);
      };

      fetchPhoto();
    }
  }, [accommodation]);

  useEffect(() => {}, [currentUser]);

  console.log("Trip data: ", trip);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-gray-200">
      <div className="w-full relative h-[95vh] overflow-hidden">
        <Image
          src={
            trip?.imageUrls[0]! ||
            "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
          }
          alt="Tours background"
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-2">
            {location?.city}, {location?.country}
          </h1>
        </div>
      </div>

      <div className="relative flex justify-center mt-[-3rem]">
        <div className="relative bg-white rounded-lg shadow-lg p-2 px-4 md:px-8 md:py-6 left-1/2 transform -translate-x-1/2 ">
          <div className="flex flex-col lg:flex-row md:gap-3 items-center">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold font-serif ">
              {name?.split(":")[0]}
              {":  "}
            </h1>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold font-serif">
              {" "}
              {name?.split(":")[1]}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center mt-4 gap-5 w-full p-2 sm:p-5">
        <div className=" bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <section>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
              {duration}-Day {location?.city} {travelStyle}
            </h1>
            <p className="text-gray-500 mt-1 text-md sm:text-xl md:text-2xl">
              {budget}, {groupType} and {interests}
            </p>
            <p className="mt-4 text-sm sm:text-md md:text-lg px-2 sm:px-4">
              {description}
            </p>
          </section>
          <section className="mt-4">
            <div className="grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4 h-100 sm:h-80 px-2 sm:px-4">
              <div className="rounded-lg overflow-hidden shadow-md col-span-1 row-span-1">
                <Image
                  src={
                    trip?.imageUrls[1]! ||
                    "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
                  }
                  alt={`Image of ${name}`}
                  width={400}
                  height={300}
                  objectFit="cover"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md col-span-1 row-span-1">
                <Image
                  src={
                    trip?.imageUrls[2]! ||
                    "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
                  }
                  alt={`Image of ${name}`}
                  width={400}
                  height={300}
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start mt-4 gap-1 sm:mt-6 px-4">
              <p className=" text-xs md:text-sm md:font-semibold flex flex-wrap gap-1  sm:gap-4">
                {pillItems.map((item, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-4 py-1 mr-1 ${item.bg} text-xs md:text-sm`}
                  >
                    {getFirstWord(item.text)}
                  </span>
                ))}
              </p>
              <p className="font-bold flex items-center ml-auto">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="w-2 h-2 sm:w-4 sm:h-4 text-yellow-400"
                  >
                    <path
                      fill="#FFD43B"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                ))}
                <span className="rounded-full px-4 py-1 ml-2  text-xs md:text-sm bg-yellow-100 text-yellow-600">
                  4.9/5.0
                </span>
              </p>
            </div>
          </section>
          <section className="mt-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
              Accommodation
            </h2>
            <div className="flex items-center gap-4 justify-between px-2 sm:px-3">
              <div className="w-full ">
                <h3 className="text-lg sm:text-lg md:text-2xl mb-1 font-semibold flex items-center justify-between">
                  {accommodation?.hotelName}
                  <span className="sm:mr-10">
                    <span className="font-bold">
                      {accommodation?.pricePerNight}
                    </span>
                    /night
                  </span>
                </h3>
                <p className=" flex items-center">
                  {Array.from({ length: accommodation?.stars ?? 0 }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="w-3 h-3 sm:w-3 sm:h-3 text-yellow-400"
                    >
                      <path
                        fill="#FFD43B"
                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                      />
                    </svg>
                  ))}
                </p>
                <p className="text-gray-600 mt-2 text-sm sm:text-md md:text-lg">
                  {accommodation?.location}
                </p>

                <div className="sm:w-2/3">
                  <h3 className="text-lg font-semibold mt-1">Amenities:</h3>
                  <ul className="list-disc list-inside text-gray-600 text-sm sm:text-[1rem] columns-2 gap-x-4">
                    {accommodation?.amenities?.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {hotelPhoto && (
                <Image
                  src={hotelPhoto}
                  alt="Hotel"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-md hidden sm:block"
                />
              )}
            </div>
          </section>
          <section className="mt-4 sm:mt-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Itinerary
            </h1>
            <div className="flex flex-col gap-3 sm:gap-5 mt-2 sm:mt-4">
              {itinerary?.map((day, index) => (
                <div
                  key={index}
                  className="px-2 sm:px-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div
                    className=" py-2 sm:py-4 flex items-center gap-3 sm:gap-12 cursor-pointer"
                    onClick={() => toggleDay(index)}
                  >
                    <h2 className="text-md sm:text-xl font-semibold">
                      DAY {day.day}
                    </h2>
                    <h3 className="font-semibold text-md sm:text-lg">
                      {day.location}
                    </h3>
                    <span className="ml-auto">
                      {expandedDays[index] ? (
                        <ChevronUp className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                      )}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {expandedDays[index] && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="list-disc list-inside px-3 pb-2 sm:pb-4">
                          {day.activities.map((activity, activityIndex) => (
                            <li
                              key={activityIndex}
                              className="mt-1 text-sm md:text-[1rem]"
                            >
                              <span className="font-semibold">
                                {activity.time}
                              </span>
                              : {activity.description}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Best Time to Visit
            </h1>
            <div className="mt-3">
              {bestTimeToVisit && bestTimeToVisit?.length > 0 ? (
                <ul className="list-disc list-inside px-2 md:px-3 text-sm md:text-[1rem]">
                  {bestTimeToVisit.map((time, index) => (
                    <li key={index} className="mt-2">
                      {time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">
                  No specific best time provided.
                </p>
              )}
            </div>
          </section>
          <section className="mt-4 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold">Weather Info</h1>
            <div className="mt-3">
              {weatherInfo && weatherInfo?.length > 0 ? (
                <ul className="list-disc list-inside px-2 md:px-3 text-sm md:text-[1rem]">
                  {weatherInfo.map((info, index) => (
                    <li key={index} className="mt-2">
                      {info}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">
                  No specific weather information provided.
                </p>
              )}
            </div>
          </section>
          <section className="mt-10 sm:px-4">
            <Map
              mapPins={
                location
                  ? [
                      {
                        latitude: location?.coordinates[0],
                        longitude: location?.coordinates[1],
                        place: location?.city || "",
                      },
                    ]
                  : []
              }
            />
          </section>
          <section className="mt-6 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">
              Tour Plan
            </h1>
            <TourPlanTable trip={trip!} />
          </section>
          <section className="mt-6 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold">FAQs</h1>
            <div className="flex flex-col gap-3 mt-2 sm:mt-4">
              {faqs && faqs.length > 0 ? (
                faqs?.map((faq, index) => (
                  <div
                    key={index}
                    className="px-2 sm:px-4 bg-gray-50 rounded-lg shadow-sm "
                  >
                    <div
                      className={` pt-2 flex items-center gap-3 sm:gap-10 cursor-pointer ${
                        expandedFaqs[index] ? "" : "pb-2"
                      } transition-all duration-100`}
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="font-semibold text-md sm:text-lg">
                        {faq.question}
                      </h3>
                      <span className="ml-auto">
                        {expandedFaqs[index] ? (
                          <ChevronUp className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                        )}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {expandedFaqs[index] && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-2">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No FAQs available for this trip.
                </p>
              )}
            </div>
          </section>
          <section className="mt-6 sm:mt-8 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold">Reviews</h1>
            <div className="flex flex-col gap-3 mt-2 sm:mt-4">
              {reviews && reviews.length > 0 ? (
                reviews?.slice(0, 5).map((review, index) => (
                  <div
                    key={index}
                    className={`p-2   shadow-sm flex flex-col ${
                      review.userId === currentUser?.id
                        ? "bg-blue-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex w-full">
                      <div>
                        <div className="flex items-center gap-1 sm:gap-2 mb-2">
                          <Image
                            src={review.userPhoto || "/default-avatar.png"}
                            alt={review.userDisplayName}
                            width={40}
                            height={40}
                            className="rounded-full mr-1 w-7 h-7 sm:w-10 sm:h-10 object-cover"
                          />
                          <div className="flex flex-col gap-0.5">
                            <h1 className="font-semibold text-sm sm:text-lg ">
                              {review.userDisplayName}
                            </h1>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              <p className=" flex items-center">
                                {Array.from(
                                  { length: review.rating ?? 0 },
                                  (_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 576 512"
                                      className="w-[10px] h-[10px] sm:w-3 sm:h-3 text-yellow-400"
                                    >
                                      <path
                                        fill="#FFD43B"
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                      />
                                    </svg>
                                  )
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {review.createdAt?.split("T")[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="px-1 sm:px-2 text-sm sm:text-[1rem]">
                          {review.comment}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        {review.imageUrl && review.imageUrl !== "" && (
                          <Image
                            src={review.imageUrl}
                            alt="Review Image"
                            width={100}
                            height={100}
                            className="rounded-md ml-auto object-cover w-16 h-16"
                          />
                        )}
                      </div>
                    </div>
                    {review.userId === currentUser?.id && (
                      <div className="flex items-center mt-2 w-full justify-end gap-2">
                        <Dialog
                          open={isEditReviewDialogOpen}
                          onOpenChange={setIsEditReviewDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="cursor-pointer px-2 md:px-4"
                              variant={"outline"}
                              onClick={() => {
                                setReviewData({
                                  comment: review.comment,
                                  rating: review.rating,
                                });
                              }}
                            >
                              <Pencil />{" "}
                              <span className="hidden sm:block">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle>Edit Review</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="comment" className="text-right">
                                  Comment
                                </Label>
                                <Textarea
                                  id="comment"
                                  value={reviewData.comment}
                                  onChange={(event) =>
                                    setReviewData((prev) => ({
                                      ...prev,
                                      comment: event.target.value,
                                    }))
                                  }
                                  className="col-span-3"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rating" className="text-right">
                                  Rating
                                </Label>
                                <Input
                                  id="rating"
                                  value={reviewData.rating}
                                  onChange={(event) =>
                                    setReviewData((prev) => ({
                                      ...prev,
                                      rating: Number(event.target.value),
                                    }))
                                  }
                                  className="col-span-3"
                                  type="number"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => handleEditReview(review.id)}
                              className="cursor-pointer"
                              disabled={editReviewLoading}
                            >
                              {editReviewLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "Update"
                              )}
                            </Button>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isDeleteReviewDialogOpen}
                          onOpenChange={setIsDeleteReviewDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              disabled={deleteReviewLoading}
                              variant={"outline"}
                              className={`w-8 h-8 md:w-20 md:h-9 ${
                                loading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Delete />{" "}
                                  <span className={`hidden md:block`}>
                                    Delete
                                  </span>
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="text-md font-bold">
                                Are you sure you want to delete your review?
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                disabled={deleteReviewLoading}
                                className={`w-8 h-8 md:w-20 md:h-9 ${
                                  deleteReviewLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                onClick={() => {
                                  handleDeleteReview(
                                    review.id,
                                    review.publicId
                                  );
                                }}
                              >
                                {deleteReviewLoading ? (
                                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <>YES</>
                                )}
                              </Button>
                              <Button
                                className="cursor-pointer w-8 h-8 md:w-20 md:h-9"
                                onClick={() =>
                                  setIsDeleteReviewDialogOpen(false)
                                }
                                disabled={deleteReviewLoading}
                              >
                                NO
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No reviews available for this trip.
                </p>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <Dialog
                open={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="cursor-pointer px-2 md:px-4"
                    variant={"outline"}
                  >
                    Leave a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add a Review</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="comment" className="text-right">
                        Comment
                      </Label>
                      <Textarea
                        id="comment"
                        value={reviewData.comment}
                        onChange={(event) =>
                          setReviewData((prev) => ({
                            ...prev,
                            comment: event.target.value,
                          }))
                        }
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">
                        Rating
                      </Label>
                      <Input
                        id="rating"
                        onChange={(event) =>
                          setReviewData((prev) => ({
                            ...prev,
                            rating: Number(event.target.value),
                          }))
                        }
                        className="col-span-3"
                        type="number"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        {"Image (optional)"}
                      </Label>
                      {reviewData.imageUrl === "" ? (
                        <Input
                          onChange={(event) =>
                            handleReviewImageUploadChange(event)
                          }
                          type="file"
                          accept="image/*"
                          className="col-span-3"
                          name="image"
                        />
                      ) : (
                        <Image
                          src={reviewData.imageUrl || ""}
                          width={300}
                          height={100}
                          alt="Review Image"
                          className="col-span-3 object-cover h-36 w-full rounded-md"
                        />
                      )}
                      {isImageUploading && (
                        <div className="col-span-4 flex items-center justify-center gap-4">
                          <h1>Uploading image </h1>
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleAddReview}
                    className="cursor-pointer"
                    disabled={addReviewLoading || isImageUploading}
                  >
                    {addReviewLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Add Review"
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        </div>

        <div className="sticky top-4 h-full bg-gray-200 flex flex-col sm:flex-row sm:justify-between sm:w-full gap-4 sm:gap-8 lg:max-w-sm lg:flex-col lg:gap-0">
          <BookingWidget
            bookingWidgetProps={{
              price: parsePriceString(trip?.estimatedPrice || "$1000") || 1000,
              startDate,
              setStartDate,
              adults,
              setAdults,
              kids,
              setKids,
              handleBooking,
            }}
          />
          
          <div className="p-4 bg-white rounded-lg shadow-lg lg:mt-4 w-full h-52">
            <div className="flex  items-center justify-center gap-2">
              <Image
                src={"/plane1.svg"}
                width={100}
                height={100}
                alt="Airplane"
                className="object-cover"
              />
              <h1 className="text-2xl font-semibold font-serif pr-4">
                Check Flights
              </h1>
            </div>
            <h1 className="text-lg font-semibold mt-4">
              Destination : {trip?.location.city}, {trip?.location.country}
            </h1>
            <Link href={`/explore/flights`}>
              <Button className="w-full mt-4 cursor-pointer">
                Check Flights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientTripPage;
