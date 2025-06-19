"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import React from "react";

const page = () => {
  const param = useParams<{ username: string }>();
  console.log(param.username);
  return <div>{param.username}</div>;
};

export default page;
