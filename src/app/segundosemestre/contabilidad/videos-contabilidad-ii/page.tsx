"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import useCourseData from "@/hooks/useCourseData";

const VideosContabilidad = () => {
  const { videos, loading, error } = useCourseData("Contabilidad II");

  if (loading) {
    return <div className="p-4 text-center">Cargando archivos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Contabilidad II" />

      <VideoCards videoItems={videos} />
    </section>
  );
};

export default VideosContabilidad;
