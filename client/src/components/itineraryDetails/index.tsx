"use client";
/* eslint-disable @typescript-eslint/no-unused-vars*/
import getPlacePhoto from "@/lib/placePhoto";
import { getFirstWord } from "@/lib/utils";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Delete,
  Loader2,
  MapPin,
  Share,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";

type TripDetailsProps = {
  trip?: Trip;
  viewFaqs: boolean;
  viewReviews: boolean;
  addFaq?: (question: string, answer: string) => void;
  deleteFaq?: (faqId: string) => void;
  itineraryId: string;
};

function ItineraryDetails({
  trip,
  viewFaqs,
  addFaq,
  deleteFaq,
  viewReviews,
  itineraryId,
}: TripDetailsProps) {
  const [user] = useAuthState(auth);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [hotelPhoto, setHotelPhoto] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newFaq, setNewFaq] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
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
    imageUrls,
    accommodation,
    faqs,
    reviews,
  } = trip || {};

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-100 !text-pink-500" },
    { text: groupType, bg: "!bg-blue-100 !text-blue-500" },
    { text: budget, bg: "!bg-purple-100 !text-purple-500" },
    { text: interests, bg: "!bg-green-100 !text-green-800" },
  ];

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  async function handleAddNewFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) {
      toast("Please fill in both question and answer fields.");
      return;
    }
    try {
      addFaq?.(newFaq.question, newFaq.answer);
      setNewFaq({ question: "", answer: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding FAQ: ", error);
    }
  }

  function handleShare() {
    setShareLoading(true);
    setShareLink("");
    setCopied(false);
    setTimeout(() => {
      setShareLink(`${window.location.origin}/shared/${itineraryId}`);
      setShareLoading(false);
    }, 1500);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
      // fetchPhoto();
    }
  }, []);

  return (
    <div>
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md max-w-5xl w-full">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
            {trip?.name}
          </h1>
          <div className="flex gap-4">
            <p className="flex items-center text-xs sm:text-sm md:text-md text-gray-600">
              <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
              {duration} day plan
            </p>
            <p className="flex items-center text-xs sm:text-sm md:text-md text-gray-600">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
              {location?.city}, {location?.country}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-1 grid-rows-3 md:grid-rows-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 h-160 sm:h-140 md:h-100">
          {imageUrls &&
            imageUrls.length > 0 &&
            imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden shadow-md ${
                  index === 0
                    ? "sm:col-span-2 sm:row-span-2"
                    : "col-span-1 row-span-1"
                }`}
              >
                <Image
                  width={500}
                  height={300}
                  src={imageUrl}
                  alt={`Trip Image ${index + 1}`}
                  className="w-full object-cover h-full"
                />
              </div>
            ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-1 sm:mt-8">
          <p className=" text-xs md:text-sm md:font-semibold flex flex-wrap gap-1  sm:gap-4">
            {pillItems.map((item, index) => (
              <span
                key={index}
                className={`rounded-full px-4 py-1 mr-1 ${item.bg} text-xs md:text-sm`}
              >
                {typeof item?.text === "string" ? getFirstWord(item.text) : ""}
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

          <Dialog
            open={shareDialogOpen}
            onOpenChange={() => {
              setShareDialogOpen((prev) => !prev);
            }}
          >
            <DialogTrigger asChild>
              <div
                onClick={() => handleShare()}
                className=" ml-auto px-3 py-1 text-sm md:text-[1rem] md:px-5 md:py-2 bg-blue-100 text-blue-600 font-semibold rounded-full md:ml-3 cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-md flex flex-row gap-1 items-center"
              >
                Share <Share className="md:h-5 md:w-5 h-4 w-4" />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
              <DialogTitle>Share Itinerary</DialogTitle>
              {shareLoading ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                  <p className="text-gray-600">Generating share link...</p>
                </div>
              ) : shareLink ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Share this link with anyone you want to view your itinerary
                  </p>

                  {/* Link Display */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                    <Button
                      onClick={handleCopy}
                      className="cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Success Message */}
                  {copied && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Link copied to clipboard!
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Click the button above to generate a share link
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <section className="mt-4 sm:mt-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
            {duration}-Day {location?.city} {travelStyle}
          </h1>
          <p className="text-gray-500 mt-1 text-md sm:text-xl md:text-2xl">
            {budget}, {groupType} and {interests}
          </p>
          <p className="mt-4 text-sm sm:text-lg px-2 sm:px-4">{description}</p>

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
        </section>
        <section className="mt-4 sm:mt-8">
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
        {viewFaqs && (
          <section>
            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <h1 className="text-xl sm:text-2xl font-semibold">FAQs</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">Add FAQ</Button>
                </DialogTrigger>
                <DialogContent className="z-dialog">
                  <DialogTitle>Add a New FAQ</DialogTitle>
                  <form>
                    <div className="mb-4">
                      <Label className="block text-sm">Question</Label>
                      <Input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                        value={newFaq.question}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, question: e.target.value })
                        }
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="mb-4">
                      <Label className="block text-sm font-medium">
                        Answer
                      </Label>
                      <Textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                        value={newFaq.answer}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, answer: e.target.value })
                        }
                        placeholder="Enter your answer"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        onClick={handleAddNewFaq}
                        className="cursor-pointer"
                      >
                        Add FAQ
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-3">
              {faqs && faqs?.length > 0 ? (
                <ul className="list-disc list-inside px-2 md:px-3 text-sm md:text-[1rem]">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-2 mb-2 flex justify-between items-center"
                    >
                      <li key={index} className="mt-2">
                        <strong>{faq.question}</strong>
                        <p className="text-gray-600 px-6">{faq.answer}</p>
                      </li>
                      <Button
                        variant={"outline"}
                        className="cursor-pointer "
                        onClick={() => {
                          deleteFaq?.(faq.id);
                          const toastId = toast.loading("Deleting FAQ...");
                          setTimeout(() => {
                            toast.dismiss(toastId);
                          }, 2000);
                          setTimeout(() => {
                            toast.success("FAQ deleted successfully!");
                          }, 1000);
                        }}
                      >
                        <Delete className="w-3 h-3 md:w-4 md:h-4" />{" "}
                        <span className="hidden sm:block">Delete</span>
                      </Button>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">No FAQs available.</p>
              )}
            </div>
          </section>
        )}

        {viewReviews && (
          <section className="mt-6 sm:mt-8 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold">Reviews</h1>
            <div className="flex flex-col gap-3 mt-2 sm:mt-4">
              {reviews && reviews.length > 0 ? (
                reviews?.slice(0, 5).map((review, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50  shadow-sm flex flex-col"
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
                              <p className="text-xs text-gray-500">
                                {review.createdAt?.split("T")[0]}
                              </p>
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
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No reviews found for this trip.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ItineraryDetails;
