"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import {
  ExplorePageHeaderContents,
  GeneratePageHeaderContents,
} from "@/lib/config";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AlignLeft, LogOut, UserRound } from "lucide-react";
import { useUser } from "@/context/authContext";
import { signOut } from "@/lib/firebase/auth";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface HeaderItem {
  title?: string;
  type?: string;
  link: string;
  icon?: any;
}

type HeaderContents = HeaderItem[];

function Header() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const { y: currentScrollY } = useWindowScroll();

  const { user, loading: authLoading } = useUser();

  const router = useRouter();
  const pathName = usePathname();

  let headerContents: HeaderContents = user
    ? []
    : [
        {
          title: "Sign Up",
          type: "button",
          link: "/auth/register",
        },
      ];

  if (pathName.startsWith("/explore")) {
    headerContents = ExplorePageHeaderContents;
  } else if (pathName.startsWith("/generate")) {
    headerContents = GeneratePageHeaderContents;
  }

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef?.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.1,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className={`fixed inset-x-2 top-2 sm:top-4 z-500 h-12 sm:h-18 border-none transition-all duration-700 sm:inset-x-6 ${
        pathName.startsWith("/admin") ? " hidden" : ""
      }`}
    >
      <header
        className={`absolute top-1/2 w-full -translate-y-1/2 px-4 ${
          pathName.startsWith("/admin") ? "hidden" : ""
        }`}
      >
        <nav className="flex size-full items-center justify-between p-1 sm:p-2">
          <div
            className={`${
              pathName.startsWith("/admin") ? "hidden" : ""
            } lg:hidden`}
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-0 md:mr-10">
                  <AlignLeft className="text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 z-1000">
                <SheetHeader className="flex justify-center items-center flex-row">
                  <SheetTitle className="text-3xl font-semibold ">
                    <span className="text-5xl text-primary ">X</span>plorer
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-1">
                  {ExplorePageHeaderContents &&
                    ExplorePageHeaderContents.length > 0 &&
                    ExplorePageHeaderContents.filter(
                      (item) => item.type === "text"
                    ).map((item, index) => (
                      <Link href={item.link} key={index}>
                        <Button
                          variant="ghost"
                          className="w-full flex justify-start"
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.title}
                        </Button>
                      </Link>
                    ))}
                  {authLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : user ? (
                    <div>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full flex justify-start"
                        >
                          <span className="mr-2">
                            <UserRound />
                          </span>
                          Profile
                        </Button>
                      </Link>
                      <div className="flex flex-col justify-center items-center space-y-2 mt-2">
                        <Button className="px-9 " onClick={() => signOut()}>
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center space-y-2 mt-2">
                      <SheetClose>
                        <Button
                          className="px-8"
                          onClick={() => {
                            router.push(
                              `/auth/login?redirect=${encodeURIComponent(
                                pathName
                              )}`
                            );
                          }}
                        >
                          Sign In
                        </Button>
                      </SheetClose>

                      <SheetClose>
                        <Button
                          className="px-8"
                          onClick={() => {
                            router.push(
                              `/auth/register?redirect=${encodeURIComponent(
                                pathName
                              )}`
                            );
                          }}
                        >
                          Sign Up
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-7 text-2xl sm:text-3xl font-semibold text-white ">
            <Link href="/explore">
              <div className="ml-2 pb-1">
                <span className="text-4xl sm:text-5xl text-primary ">X</span>
                plorer
              </div>
            </Link>
          </div>
          <div className="hidden h-full items-center lg:flex">
            <div className="hidden lg:block">
              {headerContents &&
                headerContents.length > 0 &&
                headerContents
                  .filter((item) => item.type === "text")
                  .map((item, index) => (
                    <Link href={item.link} key={index}>
                      <span key={index} className="nav-hover-btn">
                        {item.title}
                      </span>
                    </Link>
                  ))}
            </div>
          </div>
          <div className="flex h-full flex-col items-center ">
            <div className="flex">
              {headerContents &&
                headerContents.length > 0 &&
                headerContents
                  .filter((item) => item.type === "button")
                  .map((item, index) => (
                    <Link href={item.link} key={index}>
                      <Button
                        key={index}
                        variant="ghost"
                        className="bg-transparent text-white cursor-pointer border border-white hidden md:flex"
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))}
              {authLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : user ? (
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="ml-2 cursor-pointer ">
                        <AvatarImage
                          src={
                            user.photoURL ||
                            "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                          }
                          referrerPolicy="no-referrer"
                        />
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full flex justify-start cursor-pointer"
                        >
                          <UserRound />
                          Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full flex justify-start cursor-pointer"
                        onClick={() => signOut()}
                      >
                        <LogOut />
                        Sign Out
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div>
                  <Button
                    className="hidden lg:block ml-2 cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/auth/login?redirect=${encodeURIComponent(pathName)}`
                      );
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
