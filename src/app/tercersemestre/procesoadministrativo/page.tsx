"use client"
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { ProcesoAdministrativoSlugs } from "@/utils/data/routes";
import React from "react";

const ProcesoAdministrativo = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <TitleCourse course="Proceso Administrativo" />
       <SubTitleCards slugLinks={ProcesoAdministrativoSlugs} bgColor="bg-green-300" /> 
    </div>
  );
};

export default ProcesoAdministrativo;
