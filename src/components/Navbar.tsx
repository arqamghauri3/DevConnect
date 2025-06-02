"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-black text-black dark:text-white ">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          DevConnect
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>{user.name}</span>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
