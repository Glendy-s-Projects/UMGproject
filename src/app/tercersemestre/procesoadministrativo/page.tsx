"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { ProcesoAdministrativoSlugs } from "@/utils/data/routes";
import React from "react";

const ProcesoAdministrativo = () => {
  const { videos, files, loading } = useCourseData("Proceso Administrativo");
  return (
    <AppLayout title="Proceso Administrativo" activeTopicId="5">
      <MainSemesterLayout
        title="Proceso Administrativo"
        slugs={ProcesoAdministrativoSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default ProcesoAdministrativo;
