import { useUser } from "@/context/authContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { toast } from "sonner";
import { set } from "date-fns";

function ProfileCard() {
  const { user: userInfo, getUser } = useUser();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<number>(0);
  const [totalTrips, setTotalTrips] = useState<number>(0);
  const [Itineraries, setItineraries] = useState<number>(0);
  const [user] = useAuthState(auth);
  const [animatedTotalTrips, setAnimatedTotalTrips] = useState(0);
  const [animatedUpcomingTrips, setAnimatedUpcomingTrips] = useState(0);
  const [animatedCredits, setAnimatedCredits] = useState(0);
  const [animatedItineraries, setAnimatedItineraries] = useState(0);
  const [credits, setCredits] = useState<number>(0);

  async function handleImageUploadChange(
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
        console.log(response.data);
        if (response.data) {
          setImageUrl(response.data.data.url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setIsImageUploading(false);
    }
  }

  async function handleSaveChanges() {
    if (!user) return;
    const token = await user?.getIdToken();
    if (userName && userName.length < 4) {
      toast.error("Username must be at least 4 characters long");
    }
    if (!name || !userName || !imageUrl) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    if (userName !== userInfo?.userName) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/username/${userName}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.data !== null) {
          toast.error("Username already exists");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error updating username:", error);
        toast.error("Error updating username");
      }
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          name: name,
          userName: userName,
          photoUrl: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toast.success("Profile updated successfully");
        setEditProfile(false);
        getUser(userInfo?.email!, token);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Error updating user info");
      setLoading(false);
    }
  }

  function animateNumber(finalValue: number, setValue: (val: number) => void) {
    let current = 0;
    const increment = Math.max(1, Math.floor(finalValue / 30)); // smoothness control
    const interval = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        setValue(finalValue);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, 20);
  }

  useEffect(() => {
    animateNumber(totalTrips, setAnimatedTotalTrips);
  }, [totalTrips]);

  useEffect(() => {
    animateNumber(upcomingTrips, setAnimatedUpcomingTrips);
  }, [upcomingTrips]);

  useEffect(() => {
    animateNumber(credits, setAnimatedCredits);
  }, [credits]);

  useEffect(()=>{
    animateNumber(Itineraries, setAnimatedItineraries);
  }, [Itineraries]);

  useEffect(() => {
    async function fetchUpcomingTrip() {
      setLoading(true);
      try {
        const token = await user?.getIdToken();
        if (!token) {
          console.error("User is not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [tripResponse, creditsResponse, ItinerariesResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/tripBooking/user/get-upcoming-trip`,
            { headers }
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/credits`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/itineraries-count`, {
            headers,
          }),
        ]);

        setUpcomingTrips(tripResponse.data.data.upcomingTripsCount);
        setTotalTrips(tripResponse.data.data.totalTripsCount);
        setCredits(creditsResponse.data.data || 0);
        setItineraries(ItinerariesResponse.data.data || 0);
      } catch (error) {
        console.error("Error fetching upcoming trip:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchUpcomingTrip();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setImageUrl(userInfo.photoUrl);
      setName(userInfo.name);
      setUserName(userInfo.userName);
    }
  }, [userInfo]);

  return (
    <div className="bg-white flex flex-col items-center justify-between p-2 sm:p-4 rounded-lg shadow-md w-full">
      <div className="sm:hidden mr-auto">
        <h1 className="text-lg sm:text-3xl font-semibold sm:font-bold">
          Welcome, {userInfo?.name}
        </h1>
        <p className="text-xs md:text-[1rem] md:mt-1 text-[#555252]">
          "Travel is the only thing you buy that makes you Richer"
        </p>
      </div>
      <div className="flex items-center justify-between w-full">
        <div>
          <div className="hidden sm:block">
            <h1 className="text-2xl md:text-3xl font-semibold sm:font-bold">
              Welcome, {userInfo?.name}
            </h1>
            <p className="text-xs md:text-[1rem] md:mt-1 text-[#555252]">
              "Travel is the only thing you buy that makes you Richer"
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-4 md:gap-8 lg:gap-12">
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12">
              <div className="flex flex-col items-center justify-center">
                <h1 className="md:text-3xl text-2xl font-bold">
                  {animatedTotalTrips}
                </h1>
                <h2 className="text-sm md:text-base">Total Trips</h2>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="md:text-3xl text-2xl font-bold">
                  {animatedUpcomingTrips}
                </h1>
                <h2 className="text-sm md:text-base">Upcoming</h2>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12">
              <div className="flex flex-col items-center justify-center">
                <h1 className="md:text-3xl text-2xl font-bold">{animatedItineraries}</h1>
                <h2 className="text-sm md:text-base">Itineraries</h2>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="md:text-3xl text-2xl font-bold">
                  {animatedCredits}
                </h1>
                <h2 className="text-sm md:text-base">Credits left</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:pr-8 pr-4">
          <Image
            src={userInfo?.photoUrl || "/profile.jpg"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full sm:w-24 sm:h-24 w-20 h-20 object-cover "
          />
          <div className="flex justify-end mt-3">
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => setEditProfile(true)}
            >
              <SquarePen />
              Edit profile
            </Button>
          </div>
          <div className="hidden sm:block mt-2">
            <h1 className="text-sm lg:text-[1rem]">@{userInfo?.email}</h1>
          </div>
        </div>
      </div>

      <Dialog
        open={editProfile}
        onOpenChange={() => {
          setEditProfile(false);
          setImageUrl(userInfo?.photoUrl || null);
          setName(userInfo?.name || null);
          setUserName(userInfo?.userName || null);
          setIsImageUploading(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Edit Profile</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="mb-2 flex flex-col items-center justify-center">
                  {isImageUploading && (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {!isImageUploading && imageUrl && (
                    <Image
                      src={imageUrl || "/profile.jpg"}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      className="rounded-full w-16 h-16 object-cover"
                    />
                  )}
                  <Button
                    variant={"outline"}
                    className="justify-center mt-2 cursor-pointer"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <SquarePen />
                    <Input
                      ref={fileInputRef}
                      onChange={(event) => handleImageUploadChange(event)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                    />
                  </Button>
                </div>
                <div className="grid grid-cols-4 w-full items-center gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    placeholder="Enter your name"
                    name="name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 w-full items-center gap-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    value={userName || ""}
                    onChange={(e) => setUserName(e.target.value)}
                    id="userName"
                    placeholder="Enter your user name"
                    name="userName"
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveChanges}
                disabled={loading || isImageUploading}
                className="cursor-pointer w-full"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileCard;
