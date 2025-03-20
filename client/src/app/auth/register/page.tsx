"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logging, setLogging] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  function handleSignIn(event: any) {
    event.preventDefault();
    setLogging(true);

    if (password.trim() !== confirmPassword.trim()) {
      setLogging(false);
      toast.error("Passwords do not match");
      return;
    }

    if (email && password) {
      createUser(email, password, name)
        .then((user) => {
          if (user?.uid) {
            setLogging(false);
            toast.success("User registered Successfully!");
            setTimeout(() => {
              router.refresh();
              router.push(typeof redirect === "string" ? redirect : "/");
            }, 1000);
          } else {
            toast("Something went wrong");
          }
        })
        .catch((e) => {
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
        });
    } else {
      setLogging(false);
      toast.error("Please fill all the fields");
    }
  }

  function handleSignUpWithGoogle(event: any) {
    event.preventDefault();

    signInWithGoogle().then((user) => {
      if (user.uid) {
        toast.success("User registered Successfully");
        setTimeout(() => {
          router.refresh();
          router.push(typeof redirect === "string" ? redirect : "/");
        }, 1000);
      } else {
        toast.error("User SignUp Failed");
      }
    });
  }

  return (
    <main className="h-screen flex items-center justify-center bg-[url(/cover-photo.jpg)] bg-cover bg-center">
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
