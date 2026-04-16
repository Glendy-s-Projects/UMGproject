"use client";
import TitleCourse from "@/components/TitleCourse";
import { PrecalculoSlugs } from "@/utils/data/routes";
import AppLayout from "@/components/AppLayout";
import { useRouter } from "next/navigation";
import useCourseData from "@/hooks/useCourseData";

const Precalculo = () => {
  const router = useRouter();
  const { videos, files, loading } = useCourseData("Precalculo");

  return (
    <AppLayout
      title="Segundo Semestre"
      activeTopicId="2"
    >

        <main className=" pt-2 px-8 pb-16 min-h-screen max-w-7xl mx-auto">
          <section className="mb-2">
            <TitleCourse course="Precálculo" />
          </section>

          <main className="pt-24 pb-12  pr-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                {PrecalculoSlugs.filter(
                  (t) => !("videos" in t) && !("file" in t),
                ).map((topic) => (
                  <div
                    key={topic.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(topic.href)}
                  >
                    <div className="relative aspect-video bg-surface-container-highest overflow-hidden mb-6 rounded-lg transition-transform duration-300 group-hover:scale-[1.01]">
                      <div className="bg-black absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold leading-tight group-hover:underline underline-offset-4 decoration-1">
                        {topic.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section className="md:col-span-8">
              <div className="flex justify-between items-end mb-8 border-b-0">
                <h2 className="text-3xl font-black tracking-tight uppercase">
                  Videos
                </h2>
              </div>
              <div className="space-y-4">
                {loading && (
                  <p className="text-sm text-on-surface-variant">
                    Cargando videos...
                  </p>
                )}
                {videos.map((video) => (
                  <a
                    key={video.$id}
                    href={`https://www.youtube.com/watch?v=${video.youtubeCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 p-6 bg-surface-container-low hover:bg-surface-dim transition-all duration-200 ease-out cursor-pointer"
                  >
                    <div className="relative w-40 aspect-video bg-surface-container-highest flex items-center justify-center overflow-hidden">
                      {video.youtubeCode && (
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeCode}/mqdefault.jpg`}
                          alt={video.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                      <span className="material-symbols-outlined text-4xl text-white relative z-10 drop-shadow">
                        play_circle
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold tracking-tight">
                        {video.name}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="md:col-span-4">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase">
                  Archivos
                </h2>
              </div>
              <div className="space-y-px bg-outline-variant/15">
                {loading && (
                  <p className="text-sm text-on-surface-variant">
                    Cargando archivos...
                  </p>
                )}
                {files.map((file) => (
                  <a
                    key={file.$id}
                    href={file.fileRoute}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        folder
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold truncate">
                        {file.name}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant font-medium uppercase">
                        Google Drive
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-zinc-400 group-hover:text-primary transition-colors">
                      open_in_new
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
    </AppLayout>
  );
};

export default Precalculo;
