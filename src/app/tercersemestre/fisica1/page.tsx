"use client";
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { Fisica1Slugs } from "@/utils/data/routes";
import React from "react";

const Fisica1 = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <TitleCourse course="Fisica 1" />
      <SubTitleCards slugLinks={Fisica1Slugs} bgColor="bg-green-300" />
    </div>
  );
};

export default Fisica1;
