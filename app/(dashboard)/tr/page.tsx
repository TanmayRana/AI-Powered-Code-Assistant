"use client";

import React, { useEffect, useState } from "react";
import {
  AllQuestions,
  PostFullSheet,
  PostPublicSheets,
} from "@/lib/questionService";

const Track = () => {
  useEffect(() => {
    const getData = async () => {
      // const res = await AllQuestions();
      // console.log("res=", res);
      // const res1 = await PostPublicSheets();
      // console.log("res1=", res1);
      // const res2 = await PostFullSheet();
      // console.log("res2=", res2);
    };

    // getData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Track Data</h1>
    </div>
  );
};

export default Track;
