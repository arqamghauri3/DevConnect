'use client';
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const param = useParams<{ username: string }>();
  console.log(param.username)
  return <div>{param.username}
    <Button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
      className="px-4 py-2 rounded"
    >
      Sign Out
    </Button>
  </div>;
};

export default page;
