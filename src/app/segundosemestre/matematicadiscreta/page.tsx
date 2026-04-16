"use client";
import { MatematicaDiscretaSlugs } from "@/utils/data/routes";
import React from "react";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";

const MatematicaDiscreta = () => {
  const { videos, files, loading } = useCourseData("Matemática Discreta");
  return (
    <AppLayout title="Matemática Discreta" activeTopicId="4">
      <MainSemesterLayout
        title="Matemática Discreta"
        slugs={MatematicaDiscretaSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default MatematicaDiscreta;
