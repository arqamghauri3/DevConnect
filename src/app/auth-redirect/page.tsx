"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const username = session?.user?.username;
      if (username) {
        router.replace(`/${username}`);
      } else {
        router.replace("/profile");
      }
    }
  }, [session, status, router]);

  return <div>Redirecting...</div>;
}

