"use client";
import ProfileHeader from "@/components/ProfileHeader";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import React from "react";

const page = () => {
  const param = useParams<{ username: string }>();
  return (
      <div className="grid grid-cols-1">
        <div className="col-span-1">
          <ProfileHeader username={param.username}/>
        </div>

      </div>
  )

};

export default page;
