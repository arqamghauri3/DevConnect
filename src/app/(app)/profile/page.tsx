"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
const page = () => {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}!</p>
          <Button onClick={() => signOut({ callbackUrl: "/landing" })}>Sign out</Button>
        </>
      ) : (
        <>
          <p>You need to be signed in.</p>
        </>
      )}
    </>
  );
};

export default page;
