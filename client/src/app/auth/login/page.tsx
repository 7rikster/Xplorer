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
import { signIn, signInWithGoogle, signOut } from "../../../lib/firebase/auth";
import { toast } from "sonner";
import Link from "next/link";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useUser } from "@/context/authContext";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logging, setLogging] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const { loading } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  async function handleSignIn(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLogging(true);

    if (email && password) {
      try {
        const user = await signIn(email, password);
        if (user?.emailVerified === false) {
          setLogging(false);
          toast.error("Please verify your email");
          await sendEmailVerification(user, {
            url: `${
              window.location.origin
            }/auth/login?redirect=${encodeURIComponent(
              typeof redirect === "string" ? redirect : "/"
            )}`,
          });
          setVerifyEmail(true);
          await signOut();
          return;
        }

        if (user?.uid && user?.emailVerified) {
          toast.success("User Signed in Successfully");
          setLogging(false);
          setTimeout(() => {
            router.refresh();
            router.push(typeof redirect === "string" ? redirect : "/");
          }, 1000);
        } else {
          toast("Something went wrong");
        }
      } catch (e) {
        setLogging(false);
        console.log(e);
        if(!(e instanceof FirebaseError)) {
          toast.error("An unexpected error occurred");
          return;
        }
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

  async function handleSignInWithGoogle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    try {
      const user = await signInWithGoogle();

      if (user?.uid) {
        const token = await user.getIdToken();
        const username = user.email.split("@")[0];

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/username/${username}`
        );
        if (!response.data?.data) {
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
        }

        if (!loading) {
          toast.success("User logged in Successfully");
          router.refresh();
          router.push(typeof redirect === "string" ? redirect : "/");
        } else {
          toast.loading("Logging in user...");
        }
      } else {
        toast.error("User SignIn Failed");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error("An error occurred during Google Sign In");
    }
  }

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.emailVerified) {
      setVerifyEmail(false);
      setLogging(false);
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

      <Card className="p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back!!</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
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
          {/* <br /> */}
          <div className="flex flex-col justify-between items-center space-y-2 mt-2">
            <p className="text-center text-gray-600">Or Sign In using</p>
            <button
              className="rounded-full mb-2"
              onClick={handleSignInWithGoogle}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
                className="h-10"
              />
            </button>
          </div>
          <Button
            className="w-full bg-primary"
            onClick={handleSignIn}
            type="submit"
            disabled={logging}
          >
            {logging ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Link href="/auth/register">
            <p className="text-center">
              Don&apos;t have an account? Create an account
            </p>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LogIn;
