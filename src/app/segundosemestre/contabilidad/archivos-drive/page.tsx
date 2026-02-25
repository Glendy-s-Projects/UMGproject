"use client";
import DriveCard from "@/components/DriveCard";
import useCourseData from "@/hooks/useCourseData";
import React from "react";

const AlgoritmosDrive = () => {

    const { files, loading, error } = useCourseData("Contabilidad II");

  if (loading) {
    return <div className="p-4 text-center">Cargando archivos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  return <DriveCard driveFiles={files} />;
};

export default AlgoritmosDrive;
