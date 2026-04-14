import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import {
  account,
  createCourse,
  createFile,
  createVideo,
  getCourses,
  getTopics,
  getFiles,
  getVideos,
  updateTopic,
  updateCourse,
  updateVideo,
  updateFile,
  deleteCourse,
  deleteVideo,
  deleteFile,
} from "./appwrite";
import { Course, Topic } from "../type";
import { toast } from "react-toastify";

export const useAdmin = (activeTopicId?: string | null) => {
  const queryClient = useQueryClient();

  //--Estados de Formularios (Estado del cliente)--//

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [courseName, setCourseName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [videoName, setVideoName] = useState("");
  const [youtubeCode, setYoutubeCode] = useState("");

  const [fileName, setFileName] = useState("");
  const [fileRoute, setFileRoute] = useState("");

  const [activeVideoCourseId, setActiveVideoCourseId] = useState<string | null>(
    ""
  );
  const [activeFileCourseId, setActiveFileCourseId] = useState<string | null>(
    ""
  );

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicName, setEditTopicName] = useState("");

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseName, setEditCourseName] = useState("");

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoName, setEditVideoName] = useState("");
  const [editYoutubeCode, setEditYoutubeCode] = useState("");

  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState("");
  const [editFileRoute, setEditFileRoute] = useState("");

  //-- Queries (Estado del servidor)---//

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await account.get();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => ((await getTopics()) || []) as unknown as Topic[],
    enabled: !!user,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", activeTopicId],
    queryFn: async () => {
      if (!activeTopicId) return [];
      return ((await getCourses(activeTopicId)) || []) as unknown as Course[];
    },
    enabled: !!user && !!activeTopicId,
  });

  const courseIds = (courses as unknown as Course[]).map((c) => c.$id);

  const { data: files = [] } = useQuery({
    queryKey: ["files", courseIds],
    queryFn: async () => (await getFiles(courseIds)) || [],
    enabled: !!user && courseIds.length > 0,
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["videos", courseIds],
    queryFn: async () => (await getVideos(courseIds)) || [],
    enabled: !!user && courseIds.length > 0,
  });

  //----MUTATIONS (Acciones)----//
  const loginMutation = useMutation({
    mutationFn: async () => {
      await account.createEmailPasswordSession({ email, password });
      return await account.get();
    },
    onSuccess: (userData) => queryClient.setQueryData(["user"], userData),
    onError: () => {
      queryClient.setQueryData(["user"], null);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () =>
      await account.deleteSession({ sessionId: "current" }),
    onSuccess: () => queryClient.setQueryData(["user"], null),
  });

  const createCourseMutation = useMutation({
    mutationFn: () => createCourse(courseName, selectedTopic),
    onSuccess: () => {
      toast.success("Curso agregado exitosamente");
      setCourseName("");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => toast.error("Error al agregar curso"),
  });

  const createVideoMutation = useMutation({
    mutationFn: (courseId: string) =>
      createVideo(videoName, youtubeCode, courseId),
    onSuccess: () => {
      toast.success("Video agregado exitosamente");
      setVideoName("");
      setYoutubeCode("");
      setActiveVideoCourseId(null);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: () => toast.error("Error al agregar video"),
  });

  const createFileMutation = useMutation({
    mutationFn: (courseId: string) => createFile(fileName, fileRoute, courseId),
    onSuccess: () => {
      toast.success("Archivo agregado exitosamente");
      setFileName("");
      setFileRoute("");
      setActiveFileCourseId(null);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: () => toast.error("Error al agregar archivo"),
  });

  //---CRUD de Topics---//

  const updateTopicMutation = useMutation({
    mutationFn: ({
      topicId,
      newSemesterName,
    }: {
      topicId: string;
      newSemesterName: string;
    }) => updateTopic(topicId, newSemesterName),
    onSuccess: () => {
      toast.success("Tema actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      setEditingTopicId(null);
      setEditTopicName("");
    },
    onError: () => toast.error("Error al actualizar el tema"),
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      newCourseName,
    }: {
      courseId: string;
      newCourseName: string;
    }) => updateCourse(courseId, newCourseName),
    onSuccess: () => {
      toast.success("Curso actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      setEditingCourseId(null);
      setEditCourseName("");
    },
    onError: () => toast.error("Error al actualizar el curso"),
  });

  const updateVideoMutation = useMutation({
    mutationFn: ({
      videoId,
      newVideoName,
      newYoutubeCode,
    }: {
      videoId: string;
      newVideoName: string;
      newYoutubeCode: string;
    }) => updateVideo(videoId, newVideoName, newYoutubeCode),
    onSuccess: () => {
      toast.success("Video actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setEditingVideoId(null);
      setEditVideoName("");
      setEditYoutubeCode("");
    },
    onError: () => toast.error("Error al actualizar el video"),
  });

  const updateFileMutation = useMutation({
    mutationFn: ({
      fileId,
      newFileName,
      newFileRoute,
    }: {
      fileId: string;
      newFileName: string;
      newFileRoute: string;
    }) => updateFile(fileId, newFileName, newFileRoute),
    onSuccess: () => {
      toast.success("Archivo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setEditingFileId(null);
      setEditFileName("");
      setEditFileRoute("");
    },
    onError: () => toast.error("Error al actualizar el archivo"),
  });

  //-- DELETE --//
  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      toast.success("Curso eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: () => toast.error("Error al eliminar el curso"),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => {
      toast.success("Video eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: () => toast.error("Error al eliminar el video"),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      toast.success("Archivo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: () => toast.error("Error al eliminar el archivo"),
  });

  //-- Manejadores de eventos --//
  const handleCreateCourse = (e: FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate();
  };

  const handleCreateVideo = (e: FormEvent, courseId: string) => {
    e.preventDefault();
    createVideoMutation.mutate(courseId);
  };

  const handleCreateFile = (e: FormEvent, courseId: string) => {
    e.preventDefault();
    createFileMutation.mutate(courseId);
  };

  //Retornamos todo lo que la UI va a necesitar
  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    courseName,
    setCourseName,
    selectedTopic,
    setSelectedTopic,
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
    createCourseMutation,
    createVideoMutation,
    createFileMutation,
    handleCreateCourse,
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
    updateFileMutation,
    editingFileId,
    setEditingFileId,
    editFileName,
    setEditFileName,
    editFileRoute,
    setEditFileRoute,
    deleteCourseMutation,
    deleteVideoMutation,
    deleteFileMutation,
  };
};
