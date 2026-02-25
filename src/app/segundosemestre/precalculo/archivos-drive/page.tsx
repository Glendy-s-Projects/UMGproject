"use client";
import DriveCard from "@/components/DriveCard";
import useCourseData from "@/hooks/useCourseData";

const PrecalculoDrive = () => {
  const { files, loading, error } = useCourseData("Precalculo");

  if (loading) {
    return <div className="p-4 text-center">Cargando archivos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return <DriveCard driveFiles={files} />;
};

export default PrecalculoDrive;
