"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Programacion2Slugs } from "@/utils/data/routes";
import React from "react";

const Programacion2 = () => {
  const { videos, files, loading } = useCourseData("Programacion 2");
  return (
    <AppLayout title="Programacion 2" activeTopicId="4">
      <MainSemesterLayout
        title="Programacion 2"
        slugs={Programacion2Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Programacion2;
