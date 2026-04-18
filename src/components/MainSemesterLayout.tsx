import React from "react";
import TitleCourse from "./TitleCourse";
import { useRouter } from "next/navigation";
import { CiPlay1 } from "react-icons/ci";
import { FaRegFolderOpen } from "react-icons/fa";
import Link from "next/link";
import { Skeleton } from "@/context/components/ui/skeleton";
import { slugstype } from "@/types/index";
import Image from "next/image";

interface Video {
  $id: string;
  name: string;
  youtubeCode: string;
}

interface File {
  $id: string;
  name: string;
  fileRoute: string;
}

const MainSemesterLayout = ({
  title,
  slugs,
  videos,
  files,
  loading,
}: {
  title: string;
  slugs: slugstype[];
  videos: Video[];
  files: File[];
  loading: boolean;
}) => {
  const router = useRouter();
  const filteredSlugs = slugs
    ? slugs.filter((t) => !("videos" in t) && !("file" in t))
    : [];

  return (
    <main className=" py-2 px-6 min-h-screen max-w-7xl mx-auto">
      <section className="mb-2">
        <TitleCourse course={title} />
      </section>

      <main className="p-2 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[56px] w-full rounded-xl bg-surface-container-high"
                />
              ))
            ) : filteredSlugs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-start  text-center border border-dashed border-outline-variant/30">
                <p className="text-xl font-bold text-on-surface-variant mb-1">
                  Aún no hay módulos disponibles
                </p>
                <p className="text-sm text-on-surface-variant/80">
                  Vuelve más tarde para ver el contenido de este curso.
                </p>
              </div>
            ) : (
              filteredSlugs.map((topic) => (
                <div
                  key={topic.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(topic.href)}
                >
                  <div className="space-y-2 bg-surface-container-high p-2 rounded-xl">
                    <h3 className="text-xl font-bold leading-tight group-hover:underline underline-offset-4 decoration-1">
                      {topic.name}
                    </h3>
                  </div>
                </div>
              ))
            )}
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-6 bg-surface-container-low rounded-xl"
                >
                  <Skeleton className="w-40 aspect-video rounded-md bg-surface-container-highest" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-surface-container-highest" />
                    <Skeleton className="h-4 w-1/4 bg-surface-container-highest" />
                  </div>
                </div>
              ))
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-outline-variant/30 rounded-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  <CiPlay1 />
                </span>
                <p className="text-lg font-bold text-on-surface-variant mb-1">
                  No hay videos disponibles
                </p>
                <p className="text-sm text-on-surface-variant/80">
                  Vuelve más tarde para ver los videos de este curso.
                </p>
              </div>
            ) : (
              videos.map((video) => (
                <Link
                  key={video.$id}
                  href={`https://www.youtube.com/watch?v=${video.youtubeCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 p-6 bg-surface-container-low hover:bg-surface-dim transition-all duration-200 ease-out cursor-pointer"
                >
                  <div className="relative w-40 aspect-video bg-surface-container-highest flex items-center justify-center overflow-hidden">
                    {video.youtubeCode && (
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeCode}/mqdefault.jpg`}
                        alt={video.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        width={320}
                        height={180}
                      />
                    )}
                    <span className="material-symbols-outlined text-4xl text-black relative z-10 drop-shadow">
                      <CiPlay1 />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold tracking-tight">
                      {video.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="md:col-span-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-black tracking-tight uppercase">
              Archivos
            </h2>
          </div>
          <div className="space-y-px ">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-surface-container-lowest"
                >
                  <Skeleton className="w-12 h-12 rounded-md bg-surface-container-high" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2 bg-surface-container-high" />
                    <Skeleton className="h-3 w-1/4 bg-surface-container-high" />
                  </div>
                </div>
              ))
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-outline-variant/30 rounded-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  <FaRegFolderOpen />
                </span>
                <p className="text-lg font-bold text-on-surface-variant mb-1">
                  No hay archivos disponibles
                </p>
                <p className="text-sm text-on-surface-variant/80">
                  Vuelve más tarde para ver los archivos de este curso.
                </p>
              </div>
            ) : (
              files.map((file) => (
                <Link
                  key={file.$id}
                  href={file.fileRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container-low transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      <FaRegFolderOpen />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold truncate">{file.name}</h4>
                    <span className="text-[10px] text-on-surface-variant font-medium uppercase">
                      Google Drive
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-zinc-400 group-hover:text-primary transition-colors">
                    <FaRegFolderOpen />
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MainSemesterLayout;
