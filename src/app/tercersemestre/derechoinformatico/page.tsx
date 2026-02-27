"use client"
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { DerechoInformaticoSlugs } from "@/utils/data/routes";
import React from "react";

const DerechoInformatico = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <TitleCourse course="Derecho Informatico" />
       <SubTitleCards slugLinks={DerechoInformaticoSlugs} bgColor="bg-green-300" /> 
    </div>
  );
};

export default DerechoInformatico;
