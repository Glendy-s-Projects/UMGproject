import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import {
  account,
  createCourse,
  createFile,
  createVideo,
  getCourses,
  getTopics,
} from "./appwrite";
import { Course, Topic } from "../type";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  //--Estados de Formularios (Estado del cliente)--//

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [courseName, setCourseName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [videoName, setVideoName] = useState("");
  const [youtubeCode, setYoutubeCode] = useState("");
  const [selectedCourseVideo, setSelectedCourseVideo] = useState("");

  const [fileName, setFileName] = useState("");
  const [fileRoute, setFileRoute] = useState("");
  const [selectedCourseFile, setselectedCourseFile] = useState("");

  //-- Queries (Estado del servidor)---//

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await account.get();
      } catch (error) {
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
    queryKey: ["courses"],
    queryFn: async () => ((await getCourses()) || []) as unknown as Course[],
  });

  //----MUTATIONS (Acciones)----//
  const loginMutation = useMutation({
    mutationFn: async () => {
      await account.createEmailPasswordSession({ email, password });
      return await account.get();
    },
    onSuccess: (userData) => queryClient.setQueryData(["user"], userData),
    onError: () => queryClient.setQueryData(["user"], null),
  });

  const logoutMutation = useMutation({
    mutationFn: async () =>
      await account.deleteSession({ sessionId: "current" }),
    onSuccess: () => queryClient.setQueryData(["user"], null),
  });

  const createCourseMutation = useMutation({
    mutationFn: () => createCourse(courseName, selectedTopic),
    onSuccess: () => {
      alert("Curso agregado exitosamente");
      setCourseName("");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => alert("Error al agregar curso"),
  });

  const createVideoMutation = useMutation({
    mutationFn: () => createVideo(videoName, youtubeCode, selectedCourseVideo),
    onSuccess: () => {
      alert("Video agregado exitosamente");
      setVideoName("");
      setYoutubeCode("");
    },
    onError: () => alert("Error al agregar video"),
  });

  const createFileMutation = useMutation({
    mutationFn: () => createFile(fileName, fileRoute, selectedCourseVideo),
    onSuccess: () => {
      alert("Archivo agregado exitosamente");
      setFileName("");
      setFileRoute("");
    },
    onError: () => alert("Error al agregar archivo"),
  });

  //-- Manejadores de eventos --//
  const handleCreateCourse = (e: FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate();
  };
  const handleCreateVideo = (e: FormEvent) => {
    e.preventDefault();
    createVideoMutation.mutate();
  };
  const handleCreateFile = (e: FormEvent) => {
    e.preventDefault();
    createFileMutation.mutate();
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
    selectedCourseVideo,
    setSelectedCourseVideo,
    fileName,
    setFileName,
    fileRoute,
    setFileRoute,
    user,
    isUserLoading,
    topics,
    courses,
    loginMutation,
    logoutMutation,
    createCourseMutation,
    createVideoMutation,
    createFileMutation,
    handleCreateCourse,
    handleCreateVideo,
    handleCreateFile,
  };
};
