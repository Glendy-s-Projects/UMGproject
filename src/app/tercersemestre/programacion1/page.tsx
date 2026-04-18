"use client";

import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Programacion1Slugs } from "@/utils/data/routes";
import React from "react";

const Programacion1 = () => {
  const { videos, files, loading } = useCourseData("Programación 1");
  return (
    <AppLayout title="Programación 1" activeTopicId="3">
      <MainSemesterLayout
        title="Programación 1"
        slugs={Programacion1Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Programacion1;
