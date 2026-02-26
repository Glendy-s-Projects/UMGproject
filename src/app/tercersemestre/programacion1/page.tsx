"use client"

import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { Programacion1Slugs } from "@/utils/data/routes";
import React from "react";

const Programacion1 = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <TitleCourse course="Programacion 1" />
       <SubTitleCards slugLinks={Programacion1Slugs} bgColor="bg-green-300" /> 
    </div>
  );
};

export default Programacion1;
