"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Fisica2Slugs } from "@/utils/data/routes";
import React from "react";

const Fisica2 = () => {
  const { videos, files, loading } = useCourseData("Fisica 2");
  return (
    <AppLayout title="Fisica2" activeTopicId="4">
      <MainSemesterLayout
        title="Fisica21"
        slugs={Fisica2Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Fisica2;
