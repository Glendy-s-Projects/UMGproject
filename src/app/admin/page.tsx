"use client";
import { useState, useEffect, Suspense } from "react";
import { HiLogout } from "react-icons/hi";
import { useAdmin } from "../../../lib/useAdmin";
import { useRouter, useSearchParams } from "next/navigation";
import { FaExpeditedssl, FaRegAddressBook } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineUploadFile } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/context/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/context/components/ui/collapsible";
import { IoIosArrowDown } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Definimos la estructura de los datos que vienen de la base de datos
interface CourseData {
  $id: string;
  course: string;
}

interface VideoData {
  $id: string;
  name: string;
  youtubeCode: string;
  courseId: string;
}

interface FileData {
  $id: string;
  name: string;
  fileRoute: string;
  courseId: string;
}

interface TopicData {
  $id: string;
  semester: string;
}

const AdminPanelContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTopicId = searchParams.get("topicId");

  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    videoName,
    setVideoName,
    youtubeCode,
    setYoutubeCode,
    fileName,
    setFileName,
    fileRoute,
    setFileRoute,
    user,
    isUserLoading,
    topics,
    courses,
    files,
    videos,
    loginMutation,
    logoutMutation,
    createVideoMutation,
    createFileMutation,
    handleCreateVideo,
    handleCreateFile,
    activeVideoCourseId,
    setActiveVideoCourseId,
    activeFileCourseId,
    setActiveFileCourseId,
    editTopicName,
    setEditTopicName,
    editingTopicId,
    setEditingTopicId,
    updateTopicMutation,
    editCourseName,
    setEditCourseName,
    editingCourseId,
    setEditingCourseId,
    updateCourseMutation,
    editingVideoId,
    setEditingVideoId,
    editVideoName,
    setEditVideoName,
    editYoutubeCode,
    setEditYoutubeCode,
    updateVideoMutation,
    editingFileId,
    setEditingFileId,
    editFileName,
    setEditFileName,
    editFileRoute,
    setEditFileRoute,
    updateFileMutation,
    deleteCourseMutation,
    deleteVideoMutation,
    deleteFileMutation,
  } = useAdmin(activeTopicId);

  useEffect(() => {
    if (topics && topics.length > 0 && !activeTopicId) {
      router.replace(`?topicId=${topics[0].$id}`);
    }
  }, [topics, activeTopicId, router]);

  const activeTopic = topics?.find((t: TopicData) => t.$id === activeTopicId);

  if (isUserLoading) {
    return <>Cargando sesion</>;
  }

  if (user) {
    return (
      <>
        <ToastContainer position="bottom-right" theme="colored" />
        <Sidebar
          collapsible="icon"
          className="z-40 border-r border-outline-variant/15 bg-neutral-50/60 dark:bg-neutral-950/60 backdrop-blur-2xl"
        >
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarMenu className="flex flex-col gap-2">
                {topics.map((topic) => (
                  <SidebarMenuItem key={topic.$id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={topic.semester}
                      isActive={activeTopicId === topic.$id}
                      className={`flex items-center w-full p-3 rounded-lg font-bold transition-all duration-300 cursor-pointer h-auto ${
                        activeTopicId === topic.$id
                          ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                          : "bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50"
                      }`}
                    >
                      <button onClick={() => router.push(`?topicId=${topic.$id}`)}>
                        <span className="flex items-center justify-center">
                          <FaRegAddressBook size={18} />
                        </span>
                        <span className="font-inter text-sm font-medium tracking-wide uppercase group-data-[collapsible=icon]:hidden">
                          {topic.semester}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4">
            <div className="group-data-[collapsible=icon]:hidden w-full">
              <button className="w-full bg-primary text-white py-3 px-4 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
                New Course
              </button>
            </div>
            <div className="hidden group-data-[collapsible=icon]:flex w-full justify-center">
              <button
                className="bg-primary text-white p-2 rounded-md font-bold hover:bg-primary/90 transition-colors"
                title="New Course"
              >
                <IoIosAdd size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-1">
              <SidebarMenuButton
                asChild
                tooltip="Cerrar Sesión"
                className="flex items-center w-full p-3 h-auto text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-all ease-in-out rounded-lg cursor-pointer"
              >
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <span className="flex items-center justify-center">
                    <HiLogout size={18} />
                  </span>
                  <span className="font-inter text-sm font-medium tracking-wide uppercase group-data-[collapsible=icon]:hidden">
                    {logoutMutation.isPending ? "Cerrando" : "Cerrar Sesión"}
                  </span>
                </button>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 w-full bg-background transition-all duration-200 ease-linear">
          <header className="sticky top-0 w-full z-30 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-outline-variant/15">
            <div className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-2 md:gap-4 text-xl md:text-2xl max-sm:text-xs font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase">
                <SidebarTrigger />
                <span>UMG/Panel de Administracion</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <div className="text-neutral-900 dark:text-neutral-50 scale-95 transition-transform duration-150 font-bold">
                    {user.name}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-screen-xl w-full mx-auto">
            <section className=" flex flex-col items-start gap-6">
              <div className="w-full flex justify-between items-end border-b-2 border-outline-variant/30 pb-2">
                <div className="space-y-1 w-full max-w-3xl ">
                  {activeTopic && editingTopicId === activeTopic.$id ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">
                      <input
                        type="text"
                        value={editTopicName}
                        onChange={(e) => setEditTopicName(e.target.value)}
                        className="w-full text-[2.5rem] md:text-[3.5rem] font-black leading-[0.9] tracking-tighter text-on-surface bg-transparent border-b-4 border-primary focus:outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2 pb-1">
                        <button
                          onClick={() =>
                            updateTopicMutation.mutate({
                              topicId: activeTopic.$id,
                              newSemesterName: editTopicName,
                            })
                          }
                          disabled={updateTopicMutation.isPending}
                          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                        >
                          {updateTopicMutation.isPending
                            ? "Guardando..."
                            : "Guardar"}
                        </button>
                        <button
                          onClick={() => setEditingTopicId(null)}
                          className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-[2.5rem] pb-6 font-black leading-[0.9] tracking-tighter text-on-surface">
                      {activeTopic?.semester || "Seleccionar Semestre"}
                    </h1>
                  )}
                </div>
                {!editingTopicId && activeTopic && (
                  <button
                    onClick={() => {
                      setEditingTopicId(activeTopic.$id);
                      setEditTopicName(activeTopic.semester);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-dim transition-colors text-on-surface text-sm font-bold uppercase tracking-wider rounded-md"
                  >
                    <span className="material-symbols-outlined text-sm">
                      <FaEdit />
                    </span>
                    Editar
                  </button>
                )}
              </div>
            </section>

            <div className="space-y-2">
              {(courses || []).map((course: CourseData) => {
                const courseVideos = ((videos || []) as unknown as VideoData[]).filter(
                  (v) => v.courseId === course.$id
                );
                const courseFiles = ((files || []) as unknown as FileData[]).filter(
                  (f) => f.courseId === course.$id
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
                            if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
                              deleteCourseMutation.mutate(course.$id);
                            }
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
                                      onChange={(e) =>
                                        setEditVideoName(e.target.value)
                                      }
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
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-surface-container-highest rounded flex items-center justify-center overflow-hidden relative text-primary">
                                      <RxVideo size={20} />
                                    </div>
                                    <span className="body-md font-medium text-on-surface">
                                      {video.name}
                                    </span>
                                  </div>
                                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors"
                                      onClick={() => {
                                        setEditingVideoId(video.$id);
                                        setEditVideoName(video.name);
                                        setEditYoutubeCode(video.youtubeCode);
                                      }}
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error transition-colors"
                                      onClick={() => {
                                        if (window.confirm("¿Estás seguro de que deseas eliminar este video?")) {
                                          deleteVideoMutation.mutate(video.$id);
                                        }
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
                                activeFileCourseId === course.$id
                                  ? null
                                  : course.$id,
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
                                    onChange={(e) =>
                                      setEditFileName(e.target.value)
                                    }
                                    className="w-full p-2 text-sm text-on-surface bg-transparent border-b-2 border-primary focus:outline-none"
                                    placeholder="Nombre del archivo"
                                  />
                                  <input
                                    type="text"
                                    value={editFileRoute}
                                    onChange={(e) =>
                                      setEditFileRoute(e.target.value)
                                    }
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
                                        if (window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
                                          deleteFileMutation.mutate(file.$id);
                                        }
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
          </main>
        </SidebarInset>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="bottom-right" theme="colored" />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => loginMutation.mutate()}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesion"}
          </button>
          {/* <button
            type="button"
            onClick={register}
            className="w-full bg-gray-500 text-white p-2 rounded"
          >
            Registrarse
          </button> */}
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Cargando Panel...</div>}>
      <AdminPanelContent />
    </Suspense>
  );
};

export default LoginPage;
