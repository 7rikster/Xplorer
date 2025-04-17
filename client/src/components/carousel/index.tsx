"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./style.css";

interface Hoarding {
  placeId: string;
  title: string;
  description: string;
  image: string;
  location: string;
}

function Carousel() {
  const [hoarding, setHoarding] = useState<Hoarding[]>([]);
  const [buttonClicked, setButtonClicked] = useState<string | null>(null);
  const firstImageref = useRef<HTMLImageElement>(null);
  const secondImageref = useRef<HTMLImageElement>(null);
  const lastImageref = useRef<HTMLDivElement>(null);
  const firstThumbnailImageref = useRef<HTMLDivElement>(null);
  const thumbnailref = useRef<HTMLDivElement>(null);
  const contentContainerref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHoarding([
      {
        placeId: "1",
        title: "Hoarding 1",
        description:
          "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum  Description 4",
        image: "/taj-mahal.jpg",
        location: "Location 1",
      },
      {
        placeId: "2",
        title: "Hoarding 2",
        description:
          "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum  Description 4",
        image: "/paris.webp",
        location: "Location 2",
      },
      {
        placeId: "3",
        title: "Hoarding 3",
        description:
          "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum  Description 4",
        image: "/image3.jpg",
        location: "Location 3",
      },
      {
        placeId: "4",
        title: "Hoarding 4",
        description:
          "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum  Description 4",
        image: "/image4.jpg",
        location: "Location 4",
      },
    ]);
  }, []);

  const handleNext = () => {
    const [first, ...rest] = hoarding;
    setHoarding([...rest, first]);

    setButtonClicked("next");
  };

  const handlePrev = () => {
    const last = hoarding[hoarding.length - 1];
    const rest = hoarding.slice(0, hoarding.length - 1);
    setHoarding([last, ...rest]);

    setButtonClicked("prev");
  };

  useEffect(() => {
    if (buttonClicked === "next" && firstImageref.current) {
      firstImageref.current.classList.add("next");
      lastImageref.current?.classList.add("next-thumbnail-img");
      thumbnailref.current?.classList.add("next-thumbnail");
      contentContainerref.current?.classList.add("hidden");
      setButtonClicked(null);
      setTimeout(() => {
        firstImageref.current?.classList.remove("next");
        lastImageref.current?.classList.remove("next-thumbnail-img");
        thumbnailref.current?.classList.remove("next-thumbnail");
        contentContainerref.current?.classList.remove("hidden");
        contentContainerref.current?.classList.add("hoarding-content");
      }, 500);
    } else if (buttonClicked === "prev" && secondImageref.current) {
      secondImageref.current?.classList.add("prev");
      firstThumbnailImageref.current?.classList.add("prev-thumbnail-img");
      contentContainerref.current?.classList.add("hidden");

      setButtonClicked(null);
      setTimeout(() => {
        secondImageref.current?.classList.remove("prev");
        firstThumbnailImageref.current?.classList.remove("prev-thumbnail-img");
        contentContainerref.current?.classList.remove("hidden");
        contentContainerref.current?.classList.add("hoarding-content");
      }, 500);
    }
  }, [hoarding]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [hoarding]);

  return (
    <div className="w-full h-screen overflow-hidden relative ">
      <div>
        {hoarding.map((item, index) => (
          <div
            key={index}
            className="w-screen h-screen absolute inset-0 nth-1:z-1"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover "
              ref={
                index === 0
                  ? firstImageref
                  : index === 1
                  ? secondImageref
                  : null
              }
            />
            <div
              ref={index === 0 ? contentContainerref : null}
              className={`absolute top-[20%] w-[1140px] max-w-[80%] left-1/2 transform -translate-x-[55%] md:pr-[30%] box-border text-white drop-shadow-4xl `}
            >
              <h1 className="text-3xl md:text-6xl font-bold  tracking-widest">
                {item.title.toUpperCase()}
              </h1>
              <p className="font-semibold text-xl md:text-2xl mt-1 text-gray-100">
                {item.location}
              </p>
              <p className="mt-6 text-sm md:text-lg leading-4 md:leading-6">
                {item.description}
              </p>
              <Button
                variant="outline"
                className="bg-transparent cursor-pointer mt-4 w-auto text-sm"
              >
                Explore <span className="hidden md:block"> {item.title} </span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Thumbnail images */}
      <div
        className="absolute bottom-[20px] md:bottom-[50px] left-1/2 z-100 flex gap-[20px]"
        ref={thumbnailref}
      >
        {hoarding.map((item, index) =>
          index !== 0 ? (
            <div
              key={index}
              className="w-30 h-35 md:w-45 md:h-55 shrink-0 relative"
              ref={
                index === 1
                  ? firstThumbnailImageref
                  : index === hoarding.length - 1
                  ? lastImageref
                  : null
              }
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 py-3 px-1 md:px-4 text-white">
                <h1 className="font-bold text-sm md:text-xl">
                  {item.title.toUpperCase()}
                </h1>
                <p className="text-gray-100 font-bold">{item.location}</p>
              </div>
            </div>
          ) : null
        )}
      </div>
      {/* Arrows */}
      <div className="absolute top-[90%] md:top-[80%] right-[52%] w-[10rem] md:w-[25rem] max-w-[30%] flex gap-2 items-center z-10">
        <Button
          onClick={handlePrev}
          className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-[#ffffff55] text-white font-bold flex items-center justify-center cursor-pointer"
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={handleNext}
          className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-[#ffffff55] text-white font-bold flex items-center justify-center cursor-pointer"
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Carousel;
