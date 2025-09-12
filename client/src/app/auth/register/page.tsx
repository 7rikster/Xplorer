"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { FirebaseError } from "firebase/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".././../../components/ui/card";
import { createUser, signInWithGoogle } from "../../../lib/firebase/auth";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import { auth } from "../../../lib/firebase/firebaseConfig";
import { sendEmailVerification, signOut } from "firebase/auth";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/context/authContext";

function Register() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logging, setLogging] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const { loading } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  async function handleSignIn(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLogging(true);

    if (password.trim() !== confirmPassword.trim()) {
      setLogging(false);
      toast.error("Passwords do not match");
      return;
    }
    if (userName.trim() === "") {
      setLogging(false);
      toast.error("Please enter a username");
      return;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/username/${userName}`
    );
    if (response.data?.data) {
      setLogging(false);
      toast.error("Username already exists");
      return;
    }

    if (email && password) {
      try {
        const user = await createUser(email, password, name);

        if (user?.uid) {
          const token = await user.getIdToken();

          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
              {
                name,
                email,
                userName,
                photoUrl: user.photoURL,
                firebaseId: user.uid,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (error) {
            console.error("Error creating user:", error);
          }

          await user.reload();
          if (!user.emailVerified) {
            setLogging(false);
            setVerifyEmail(true);
            await sendEmailVerification(user, {
              url: `${
                window.location.origin
              }/auth/login?redirect=${encodeURIComponent(
                typeof redirect === "string" ? redirect : "/"
              )}`,
            });
            toast.success("Verification email sent!");
            await signOut(auth);
          }
        } else {
          toast("Something went wrong");
        }
      } catch (e) {
        if(!(e instanceof FirebaseError)) {
          toast.error("An unexpected error occurred");
          return;
        }
        setLogging(false);
        console.log(e);
        const errorCode = e.code;
        const errorMessage = e.message;

        if (errorCode === "auth/invalid-credential") {
          toast("Invalid credentials!");
        } else if (errorCode === "auth/invalid-email") {
          toast("Enter an email!");
        } else if (errorCode === "auth/missing-password") {
          toast("Enter the password!");
        } else {
          toast(`${errorMessage}`);
        }
      }
    } else {
      setLogging(false);
      toast.error("Please fill all the fields");
    }
  }

  async function handleSignUpWithGoogle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    try {
      const user = await signInWithGoogle();

      if (user?.uid) {
        const token = await user.getIdToken();
        const username = user.email.split("@")[0];

        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
            {
              name: user.displayName,
              email: user.email,
              userName: username,
              photoUrl: user.photoURL,
              firebaseId: user.uid,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error creating user:", error);
        }
        

        if (!loading) {
          toast.success("User registered Successfully");
          router.refresh();
          router.push(typeof redirect === "string" ? redirect : "/");
        }
        else{
          toast.loading("Registering user...");
        }
      } else {
        toast.error("User SignUp Failed");
      }
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      toast.error("An error occurred during Google Sign Up");
    }
  }

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.emailVerified) {
      setVerifyEmail(false);
      setLogging(false);
      toast.success("User registered Successfully!");
      setTimeout(() => {
        router.refresh();
        router.push(typeof redirect === "string" ? redirect : "/");
      }, 1000);
    }
  }, []);

  return (
    <main className="h-screen flex items-center justify-center bg-[url(/cover-photo.jpg)] bg-cover bg-center">
      <Dialog open={verifyEmail}>
        <DialogContent>
          <DialogTitle className="w-full text-2xl text-center">
            Verify your email
          </DialogTitle>
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">
              A verification link has been sent to your email. Please verify
              your email to continue.
            </p>
            <p className="text-center">
              If you didn&apos;t receive the email, please check your spam folder or
              click the button below to resend the verification email.
            </p>
            <Button
              onClick={async () => {
                const user = auth.currentUser;
                if (user) {
                  await sendEmailVerification(user, {
                    url: `${
                      window.location.origin
                    }/auth/register?redirect=${encodeURIComponent(
                      typeof redirect === "string" ? redirect : "/"
                    )}`,
                  });
                  toast.success("Verification email sent!");
                }
              }}
            >
              Resend Verification Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="p-6 space-y-4 w-100">
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome to <span className="text-primary ">X</span>
            plorer
          </CardTitle>
          <CardDescription>
            Discover the world, one place at a time with Xplorer!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="name"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="name">UserName</Label>
            <Input
              type="name"
              name="userName"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {/* <br /> */}
          <div className="flex flex-col justify-between items-center space-y-2 mt-2">
            <p className="text-center text-gray-600">Or Sign Up using</p>
            <button
              className="rounded-full mb-2"
              onClick={handleSignUpWithGoogle}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
                className="h-10"
              />
            </button>
          </div>
          <Button
            className="w-full"
            onClick={handleSignIn}
            type="submit"
            disabled={logging}
          >
            {logging ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Link href="/auth/login">
            <p className="text-center">Already have an account? Sign in</p>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default Register;
