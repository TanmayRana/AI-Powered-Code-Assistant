"use client";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <UserProfile routing="hash" />
    </div>
  );
};

export default ProfilePage;
