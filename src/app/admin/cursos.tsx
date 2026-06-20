import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/context/components/ui/collapsible";
import { CourseData, FileData, TopicData, VideoData } from "../types";
import { IoIosAdd, IoIosArrowDown } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineUploadFile } from "react-icons/md";
import { RxVideo } from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "../../../lib/useAdmin";
import { useSearchParams } from "next/navigation";
import { UseMutationResult } from "@tanstack/react-query";

interface CursosAdminProps {
  topics: TopicData[];
  editingCourseId: string | null;
  setEditingCourseId: React.Dispatch<React.SetStateAction<string | null>>;
  editCourseName: string;
  setEditCourseName: React.Dispatch<React.SetStateAction<string>>;
  updateCourseMutation: UseMutationResult<unknown, Error, { courseId: string; newCourseName: string }, unknown>;
  deleteCourseMutation: UseMutationResult<unknown, Error, string, unknown>;
  activeVideoCourseId: string | null;
  setActiveVideoCourseId: React.Dispatch<React.SetStateAction<string | null>>;
  activeFileCourseId: string | null;
  setActiveFileCourseId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingTopicId: React.Dispatch<React.SetStateAction<string | null>>;
  editTopicName: string;
  setEditTopicName: React.Dispatch<React.SetStateAction<string>>;
  updateTopicMutation: UseMutationResult<unknown, Error, { topicId: string; newSemesterName: string }, unknown>;
  deleteTopicMutation: UseMutationResult<unknown, Error, string, unknown>;
  confirmAction: (
    title: string,
    description: string,
    action: () => void,
  ) => void;
  handleCreateVideo: (e: React.FormEvent, courseId: string) => void;
  createVideoMutation: UseMutationResult<unknown, Error, string, unknown>;
  editingVideoId: string | null;
  setEditingVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  editVideoName: string;
  setEditVideoName: React.Dispatch<React.SetStateAction<string>>;
  editYoutubeCode: string;
  setEditYoutubeCode: React.Dispatch<React.SetStateAction<string>>;
  updateVideoMutation: UseMutationResult<unknown, Error, { videoId: string; newVideoName: string; newYoutubeCode: string }, unknown>;
  deleteVideoMutation: UseMutationResult<unknown, Error, string, unknown>;
  handleCreateFile: (e: React.FormEvent, courseId: string) => void;
  createFileMutation: UseMutationResult<unknown, Error, string, unknown>;
  editingFileId: string | null;
  setEditingFileId: React.Dispatch<React.SetStateAction<string | null>>;
  editFileName: string;
  setEditFileName: React.Dispatch<React.SetStateAction<string>>;
  editFileRoute: string;
  setEditFileRoute: React.Dispatch<React.SetStateAction<string>>;
  updateFileMutation: UseMutationResult<unknown, Error, { fileId: string; newFileName: string; newFileRoute: string }, unknown>;
  deleteFileMutation: UseMutationResult<unknown, Error, string, unknown>;
  videoName: string;
  setVideoName: React.Dispatch<React.SetStateAction<string>>;
  youtubeCode: string;
  setYoutubeCode: React.Dispatch<React.SetStateAction<string>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  fileRoute: string;
  setFileRoute: React.Dispatch<React.SetStateAction<string>>;
  activeTopic: TopicData | null;
}

const CursosAdmin = ({
  editingCourseId,
  setEditingCourseId,
  editCourseName,
  setEditCourseName,
  updateCourseMutation,
  deleteCourseMutation,
  activeVideoCourseId,
  setActiveVideoCourseId,
  activeFileCourseId,
  setActiveFileCourseId,
  handleCreateVideo,
  createVideoMutation,
  editingVideoId,
  setEditingVideoId,
  editVideoName,
  setEditVideoName,
  editYoutubeCode,
  setEditYoutubeCode,
  updateVideoMutation,
  deleteVideoMutation,
  confirmAction,
  handleCreateFile,
  createFileMutation,
  editingFileId,
  setEditingFileId,
  editFileName,
  setEditFileName,
  editFileRoute,
  setEditFileRoute,
  updateFileMutation,
  deleteFileMutation,
  videoName,
  setVideoName,
  youtubeCode,
  setYoutubeCode,
  fileName,
  setFileName,
  fileRoute,
  setFileRoute,
  activeTopic,
}: CursosAdminProps) => {
  const searchParams = useSearchParams();
  const activeTopicId = searchParams.get("topicId");

  const { videos, files, courses } = useAdmin(activeTopicId);
  return (
    <div className="space-y-2">
      {(courses || []).map((course: CourseData) => {
        const courseVideos = ((videos || []) as unknown as VideoData[]).filter(
          (v) => v.courseId === course.$id,
        );
        const courseFiles = ((files || []) as unknown as FileData[]).filter(
          (f) => f.courseId === course.$id,
        );

        return (
          <Collapsible
            className="bg-surface-container-low p-2  rounded-xl"
            key={course.$id}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-full">
                {activeTopic && editingCourseId === course.$id ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full mb-8">
                    <input
                      type="text"
                      value={editCourseName}
                      onChange={(e) => setEditCourseName(e.target.value)}
                      className="w-full text-[2.5rem] font-black leading-[0.9] tracking-tighter text-on-surface bg-transparent border-b-4 border-primary focus:outline-none"
                      autoFocus
                    />
                    <div className="flex gap-2 pb-1">
                      <button
                        onClick={() =>
                          updateCourseMutation.mutate({
                            courseId: course.$id,
                            newCourseName: editCourseName,
                          })
                        }
                        disabled={updateCourseMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                      >
                        {updateCourseMutation.isPending
                          ? "Guardando..."
                          : "Guardar"}
                      </button>
                      <button
                        className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                        onClick={() => setEditingCourseId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <CollapsibleTrigger className="group flex items-center gap-3 hover:text-primary transition-colors text-left outline-none w-full">
                    <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-data-[state=open]:rotate-180">
                      <IoIosArrowDown />
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight  text-on-surface">
                      {course.course}
                    </h2>
                  </CollapsibleTrigger>
                )}
              </div>
              {!editingCourseId && activeTopic && (
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    className="text-on-surface-variant hover:text-on-surface transition-colors p-2 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCourseId(course.$id);
                      setEditCourseName(course.course);
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">
                      <FaEdit />
                    </span>
                  </button>
                  <button
                    className="text-on-surface-variant hover:text-error transition-colors p-2 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmAction(
                        "Eliminar Curso",
                        "¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.",
                        () => {
                          deleteCourseMutation.mutate(course.$id);
                        },
                      );
                    }}
                    disabled={deleteCourseMutation.isPending}
                  >
                    <span className="material-symbols-outlined text-sm">
                      <MdDeleteOutline />
                    </span>
                  </button>
                </div>
              )}
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 mt-4 border-t border-outline-variant/15">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-outline-variant/15 pb-4">
                    <h3 className="font-black text-xl uppercase tracking-tighter">
                      Videos
                    </h3>
                    <button
                      className="material-symbols-outlined text-primary-fixed"
                      onClick={() =>
                        setActiveVideoCourseId(
                          activeVideoCourseId === course.$id
                            ? null
                            : course.$id,
                        )
                      }
                    >
                      <IoIosAdd />
                    </button>
                  </div>
                  {/* Acordeón: Formulario Inline para Videos */}
                  {activeVideoCourseId === course.$id && (
                    <form
                      onSubmit={(e) => handleCreateVideo(e, course.$id)}
                      className="space-y-2 mb-4 bg-white p-2 rounded"
                    >
                      <input
                        type="text"
                        placeholder="Nombre del video"
                        value={videoName}
                        onChange={(e) => setVideoName(e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Código de YouTube"
                        value={youtubeCode}
                        onChange={(e) => setYoutubeCode(e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                        required
                      />
                      <button
                        type="submit"
                        disabled={createVideoMutation.isPending}
                        className="w-full bg-black text-white p-1 text-sm rounded"
                      >
                        {createVideoMutation.isPending
                          ? "Guardando..."
                          : "Guardar"}
                      </button>
                    </form>
                  )}

                  <ul className="space-y-2">
                    {courseVideos.map((video) =>
                      editingVideoId === video.$id ? (
                        <li
                          key={video.$id}
                          className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30"
                        >
                          <div className="flex flex-col gap-3">
                            <input
                              type="text"
                              value={editVideoName}
                              onChange={(e) => setEditVideoName(e.target.value)}
                              className="w-full p-2 text-sm text-on-surface bg-transparent border-b-2 border-primary focus:outline-none"
                              placeholder="Nombre del video"
                            />
                            <input
                              type="text"
                              value={editYoutubeCode}
                              onChange={(e) =>
                                setEditYoutubeCode(e.target.value)
                              }
                              className="w-full p-2 text-sm text-on-surface bg-transparent border-b-2 border-primary focus:outline-none"
                              placeholder="Código de YouTube"
                            />
                            <div className="flex gap-2 justify-end mt-2">
                              <button
                                onClick={() =>
                                  updateVideoMutation.mutate({
                                    videoId: video.$id,
                                    newVideoName: editVideoName,
                                    newYoutubeCode: editYoutubeCode,
                                  })
                                }
                                disabled={updateVideoMutation.isPending}
                                className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                              >
                                {updateVideoMutation.isPending
                                  ? "Guardando..."
                                  : "Guardar"}
                              </button>
                              <button
                                onClick={() => setEditingVideoId(null)}
                                className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </li>
                      ) : (
                        <li
                          key={video.$id}
                          className="group flex items-center justify-between p-4 bg-surface-container-lowest hover:bg-surface-dim transition-all duration-200 rounded-lg"
                        >
                          <Link
                            className="flex items-center gap-4"
                            href={`https://www.youtube.com/watch?v=${video.youtubeCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="w-12 h-8 bg-surface-container-highest rounded flex items-center justify-center overflow-hidden relative text-primary">
                              <RxVideo size={20} />
                              <Image
                                src={`https://img.youtube.com/vi/${video.youtubeCode}/mqdefault.jpg`}
                                alt={video.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                width={320}
                                height={180}
                              />
                            </div>

                            <span className="body-md flex flex-col gap-0 font-medium text-on-surface">
                              {video.name}
                              <span className="body-md text-[0.6rem] text-on-surface-variant ">
                                {video.youtubeCode}
                              </span>
                            </span>
                          </Link>
                          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              onClick={() => {
                                setEditingVideoId(video.$id);
                                setEditVideoName(video.name);
                                setEditYoutubeCode(video.youtubeCode);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                              onClick={() => {
                                confirmAction(
                                  "Eliminar Video",
                                  "¿Estás seguro de que deseas eliminar este video?",
                                  () => {
                                    deleteVideoMutation.mutate(video.$id);
                                  },
                                );
                              }}
                              disabled={deleteVideoMutation.isPending}
                            >
                              <MdDeleteOutline />
                            </button>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-outline-variant/15 pb-4">
                    <h3 className="font-black text-xl uppercase tracking-tighter">
                      Archivos
                    </h3>
                    <button
                      className="material-symbols-outlined text-primary-fixed hover:text-primary transition-colors"
                      onClick={() =>
                        setActiveFileCourseId(
                          activeFileCourseId === course.$id ? null : course.$id,
                        )
                      }
                    >
                      <MdOutlineUploadFile />
                    </button>
                  </div>

                  {/* Acordeón: Formulario Inline para Archivos */}
                  {activeFileCourseId === course.$id && (
                    <form
                      onSubmit={(e) => handleCreateFile(e, course.$id)}
                      className="space-y-2 mb-4 bg-white p-2 rounded border border-outline-variant/30"
                    >
                      <input
                        type="text"
                        placeholder="Nombre del archivo"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full p-2 text-sm text-on-surface bg-transparent border-b border-primary focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="URL del archivo"
                        value={fileRoute}
                        onChange={(e) => setFileRoute(e.target.value)}
                        className="w-full p-2 text-sm text-on-surface bg-transparent border-b border-primary focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        disabled={createFileMutation.isPending}
                        className="w-full mt-2 bg-primary hover:bg-primary/90 text-white p-2 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        {createFileMutation.isPending
                          ? "Guardando..."
                          : "Guardar"}
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {courseFiles.map((file) =>
                      editingFileId === file.$id ? (
                        <div
                          key={file.$id}
                          className="flex flex-col gap-2 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg w-full"
                        >
                          <input
                            type="text"
                            value={editFileName}
                            onChange={(e) => setEditFileName(e.target.value)}
                            className="w-full p-2 text-sm text-on-surface bg-transparent border-b-2 border-primary focus:outline-none"
                            placeholder="Nombre del archivo"
                          />
                          <input
                            type="text"
                            value={editFileRoute}
                            onChange={(e) => setEditFileRoute(e.target.value)}
                            className="w-full p-2 text-sm text-on-surface bg-transparent border-b-2 border-primary focus:outline-none"
                            placeholder="URL del archivo"
                          />
                          <div className="flex gap-2 justify-end mt-2">
                            <button
                              onClick={() =>
                                updateFileMutation.mutate({
                                  fileId: file.$id,
                                  newFileName: editFileName,
                                  newFileRoute: editFileRoute,
                                })
                              }
                              disabled={updateFileMutation.isPending}
                              className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              {updateFileMutation.isPending
                                ? "Guardando..."
                                : "Guardar"}
                            </button>
                            <button
                              onClick={() => setEditingFileId(null)}
                              className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={file.$id}
                          className="group flex items-center gap-3 pl-4 pr-2 py-2 bg-surface-container-lowest border border-outline-variant/15 hover:bg-surface-dim transition-colors rounded-full text-on-surface"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="w-6 h-6 rounded-full hover:bg-on-surface/10 flex items-center justify-center text-primary transition-colors"
                              onClick={() => {
                                setEditingFileId(file.$id);
                                setEditFileName(file.name);
                                setEditFileRoute(file.fileRoute);
                              }}
                            >
                              <span className="material-symbols-outlined text-xs">
                                <FaEdit />
                              </span>
                            </button>
                            <button
                              className="w-6 h-6 rounded-full hover:bg-error/10 flex items-center justify-center text-error transition-colors"
                              onClick={() => {
                                confirmAction(
                                  "Eliminar Archivo",
                                  "¿Estás seguro de que deseas eliminar este archivo?",
                                  () => {
                                    deleteFileMutation.mutate(file.$id);
                                  },
                                );
                              }}
                              disabled={deleteFileMutation.isPending}
                            >
                              <span className="material-symbols-outlined text-xs">
                                <MdDeleteOutline />
                              </span>
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default CursosAdmin;
