"use client";

import { LandingPage } from "@/components/landing-page";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  // console.log("User:", user);
  // console.log("User:", user?.primaryEmailAddress?.emailAddress);

  useEffect(() => {
    if (!user) return; // wait until user is loaded

    const createUser = async () => {
      try {
        const res = await axios.post("/api/users", {
          email: user?.primaryEmailAddress?.emailAddress,
          fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
          imageUrl: user.imageUrl,
          clerkId: user.id,
        });
        // console.log("User creation response:", res.data);
      } catch (err: any) {
        console.error(
          "Error creating user:",
          err.response?.data || err.message
        );
      }
    };

    createUser();
  }, [user]);

  return <LandingPage />;
}
