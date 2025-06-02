"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SunIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
const page = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white">
      <div className="w-full flex justify-between items-center p-4 ">
        <div className="w-8 h-8 bg-black rounded text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-lg">DC</div>
        <div>
          <Button onClick={toggleTheme} className="bg-white rounded-full dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <SunIcon />
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-center items-center gap-30">
        {/* Left Section */}
        <section className="text-center md:text-left max-w-xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold">Happening Now</h1>
          <p className="text-xl md:text-2xl font-semibold">
            Join the developer community today.
          </p>
          <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-left">
            <li>Connect with developers from around the world</li>
            <li>Share your projects and ideas</li>
            <li>Get feedback and improve your skills</li>
            <li>Participate in discussions and events</li>
          </ul>
        </section>

        {/* Right Section */}
        <section className="w-full max-w-md space-y-4">
          {isSignUp ? (
            <>
              <div>
                <p className="text-center text-lg font-bold">Join today.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  Sign Up with GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  Sign Up with Google
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-center text-lg font-bold">
                  Sign in to DevConnect.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  Sign In with GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  Sign In with Google
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            or
          </div>

          <div>{isSignUp ? <SignUpForm /> : <SignInForm />}</div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-500 hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-500 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-10">
        <Separator />
        <Footer />
      </footer>
    </div>
  );
};

export default page;
