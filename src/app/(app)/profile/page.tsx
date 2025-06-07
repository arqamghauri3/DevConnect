"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.replace(`/${session.user?.username}`);
  }
  return (
    <>
      {!session && (
        <>
          <p>You need to be signed in.</p>
        </>
      )}
    </>
  );
};

export default page;
