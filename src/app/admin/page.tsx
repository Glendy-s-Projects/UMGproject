"use client";
import { useEffect, Suspense, useState } from "react";
import { useAdmin } from "../../../lib/useAdmin";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineUploadFile } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/context/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/context/components/ui/dialog";
import { IoIosArrowDown } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "@/components/AppLayout";

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
    createTopicMutation,
    createCourseMutation,
    courseName,
    setCourseName,
    handleCreateCourse,
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
    deleteTopicMutation,
  } = useAdmin(activeTopicId);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => {} });

  useEffect(() => {
    if (user && topics && topics.length > 0 && !activeTopicId) {
      router.replace(`?topicId=${topics[0].$id}`);
    } else if (!isUserLoading && !user && activeTopicId) {
      router.replace("/admin");
    }
  }, [user, isUserLoading, topics, activeTopicId, router]);

  const activeTopic = topics?.find((t: TopicData) => t.$id === activeTopicId);

  useEffect(() => {
    const savedCreds = localStorage.getItem("adminCreds");
    if (savedCreds) {
      try {
        const { savedEmail, savedPassword } = JSON.parse(savedCreds);
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      } catch (e) {
        console.error("Error al cargar credenciales guardadas", e);
      }
    }
  }, [setEmail, setPassword]);

  const confirmAction = (title: string, description: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      onConfirm: action,
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
        Cargando sesión...
      </div>
    );
  }

  if (user) {
    return (
      <AppLayout
        title="Panel de Administración"
        activeTopicId={activeTopicId}
        customTopics={topics}
        isAdmin={true}
        onLogout={() => logoutMutation.mutate()}
        isLogoutPending={logoutMutation.isPending}
        onTopicSelectOverride={(id) => router.push(`?topicId=${id}`)}
        onCreateTopic={() => {
          setIsTopicDialogOpen(true);
        }}
        breadcrumbs={[{ label: "Panel de Administración", href: "/admin" }]}
        headerRightContent={
          <div className="flex items-center space-x-4">
            <div className="text-neutral-900 dark:text-neutral-50 scale-95 transition-transform duration-150 font-bold">
              {user.name}
            </div>
          </div>
        }
      >
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
                <div className="flex items-center gap-2 shrink-0">
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
                  </button>
                  <button
                    onClick={() => setIsCourseDialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold uppercase tracking-wider rounded-md"
                    title="Agregar Nuevo Curso"
                  >
                    <IoIosAdd size={20} />
                  </button>
                  <button
                    onClick={() => {
                      confirmAction(
                        "Eliminar Semestre",
                        "¿Estás seguro de que deseas eliminar este semestre por completo? Esta acción no se puede deshacer y borrará todos los cursos dentro de él.",
                        () => {
                          deleteTopicMutation.mutate(activeTopic.$id, {
                            onSuccess: () => router.replace("/admin"),
                          });
                        }
                      );
                    }}
                    disabled={deleteTopicMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 transition-colors text-destructive-foreground text-sm font-bold uppercase tracking-wider rounded-md"
                    title="Eliminar Semestre"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-2">
            {(courses || []).map((course: CourseData) => {
              const courseVideos = (
                (videos || []) as unknown as VideoData[]
              ).filter((v) => v.courseId === course.$id);
              const courseFiles = (
                (files || []) as unknown as FileData[]
              ).filter((f) => f.courseId === course.$id);

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
                              }
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
                                      confirmAction(
                                        "Eliminar Video",
                                        "¿Estás seguro de que deseas eliminar este video?",
                                        () => {
                                          deleteVideoMutation.mutate(video.$id);
                                        }
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
                                      confirmAction(
                                        "Eliminar Archivo",
                                        "¿Estás seguro de que deseas eliminar este archivo?",
                                        () => {
                                          deleteFileMutation.mutate(file.$id);
                                        }
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
        </main>

        <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                Nuevo Semestre
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <input
                type="text"
                placeholder="Nombre del semestre"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsTopicDialogOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newTopicName.trim() !== "") {
                      createTopicMutation.mutate(newTopicName.trim(), {
                        onSuccess: () => {
                          setIsTopicDialogOpen(false);
                          setNewTopicName("");
                        },
                      });
                    }
                  }}
                  disabled={createTopicMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  {createTopicMutation.isPending ? "Guardando..." : "Crear"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                Agregar Nuevo Curso
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCourseMutation.mutate(activeTopic?.$id || "", {
                  onSuccess: () => {
                    setIsCourseDialogOpen(false);
                    setCourseName("");
                  },
                });
              }}
              className="flex flex-col gap-4 py-4"
            >
              <input
                type="text"
                placeholder="Nombre del curso"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseDialogOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createCourseMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  {createCourseMutation.isPending
                    ? "Guardando..."
                    : "Agregar Curso"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación general para eliminar */}
        <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, isOpen: open }))}>
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                {confirmDialog.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <p className="text-on-surface-variant font-medium">
                {confirmDialog.description}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-black tracking-tight mb-6 text-center text-on-surface uppercase">
          Iniciar Sesión
        </h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <div className="flex items-center space-x-2 px-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary transition-all cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-on-surface-variant font-medium cursor-pointer select-none"
            >
              Recordar mis datos
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              if (rememberMe) {
                localStorage.setItem(
                  "adminCreds",
                  JSON.stringify({
                    savedEmail: email,
                    savedPassword: password,
                  }),
                );
              } else {
                localStorage.removeItem("adminCreds");
              }
              loginMutation.mutate();
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesion"}
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
          Cargando Panel...
        </div>
      }
    >
      <AdminPanelContent />
    </Suspense>
  );
};

export default LoginPage;
