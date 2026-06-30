import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { AppwriteException } from "appwrite";
import {
  account,
  createCourse,
  createFile,
  createVideo,
  getCourses,
  createTopic,
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
  deleteTopic,
  createRecoveryCodes,
  //regenerateRecoveryCodes,
  setupTotp,
  verifyTotpSetup,
  enableMfa,
  createMfaChallenge,
  verifyMfaChallenge,
} from "./appwrite";
import { Course, Topic } from "../type";
import { toast } from "react-toastify";

interface AppwriteError {
  type?: string;
  code?: number;
  message?: string;
}

interface MfaRecoveryCodesResponse {
  recoveryCodes?: string[];
  codes?: string[];
  secret?: string | string[];
}

interface MfaTotpResponse {
  uri: string;
  secret: string;
}

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

  //-- Estados de MFA --//
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [mfaChallengeId, setMfaChallengeId] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [qrUri, setQrUri] = useState("");
  const [mfaSetupStep, setMfaSetupStep] = useState(0);

  //-- Queries (Estado del servidor)---//

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await account.get();
      } catch (error: unknown) {
        const isAuthError = error instanceof AppwriteException && error.code === 401;
        if (!isAuthError) {
          console.error("Error inesperado al obtener la sesión:", error);
        }
        return null;
      }
    },
    retry: false,
    enabled: !isMfaRequired, // No intentar obtener usuario si estamos en flujo MFA
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
      try {
        await account.createEmailPasswordSession({ email, password });
        return await account.get();
      } catch (error: unknown) {
        const appwriteError = error as AppwriteError;
        // Si el error es por MFA requerido, no lo lanzamos, lo manejamos
        if (appwriteError?.type === 'user_more_factors_required') {
          throw error; // Lo lanzamos para que onError lo maneje
        }
        throw error;
      }
    },
    onSuccess: (userData) => queryClient.setQueryData(["user"], userData),
    onError: async (error: unknown) => {
      const appwriteError = error as AppwriteError;
      // Si el error es por MFA requerido
      if (appwriteError?.type === 'user_more_factors_required') {
        try {
          // Crear el desafío MFA
          const challenge = await createMfaChallenge();
          setMfaChallengeId(challenge.$id);
          setIsMfaRequired(true);
          toast.info("Ingresa tu código de autenticación");
        } catch (mfaError) {
          console.error("Error al crear desafío MFA:", mfaError);
          toast.error("Error al iniciar verificación MFA");
        }
      } else {
        queryClient.setQueryData(["user"], null);
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () =>
      await account.deleteSession({ sessionId: "current" }),
    onSuccess: () => queryClient.setQueryData(["user"], null),
  });

  const createCourseMutation = useMutation({
    mutationFn: (topicId: string) => createCourse(courseName, topicId),
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

  const createTopicMutation = useMutation({
    mutationFn: (newSemesterName: string) => createTopic(newSemesterName),
    onSuccess: () => {
      toast.success("Semestre agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: () => toast.error("Error al agregar semestre"),
  });

  const generateRecoveryCodesMutation = useMutation({
    mutationFn: async () => {
      try {
        return await createRecoveryCodes();
      } catch (error: unknown) {
        const appwriteError = error as AppwriteError & { skipRecovery?: boolean };
        // Si ya existen códigos, lanzar el error para manejarlo en onError
        if (appwriteError?.code === 409) {
          throw { ...appwriteError, skipRecovery: true };
        }
        throw error;
      }
    },
    onSuccess: (data: MfaRecoveryCodesResponse) => {
      // Intentar diferentes estructuras posibles
      const codes = data.recoveryCodes || data.codes || 
        (Array.isArray(data.secret) ? data.secret : []) || [];
      setRecoveryCodes(codes);
    },
    onError: (error: unknown) => {
      const appwriteError = error as AppwriteError & { skipRecovery?: boolean };
      // No mostrar toast si es el error de códigos ya generados
      if (!appwriteError?.skipRecovery) {
        toast.error("Error al generar códigos de recuperación");
      }
    },
  });

  const setupTotpMutation = useMutation({
    mutationFn: async () => await setupTotp(),
    onSuccess: (data: MfaTotpResponse) => {
      setQrUri(data.uri);
    },
    onError: () => toast.error("Error al iniciar configuración de TOTP"),
  });

  const verifyAndEnableMfaMutation = useMutation({
    mutationFn: async (code: string) => {
      await verifyTotpSetup(code);
      await enableMfa();
      return await account.get();
    },
    onSuccess: (userData) => {
      toast.success("MFA activado exitosamente");
      setMfaSetupStep(0);
      queryClient.setQueryData(["user"], userData);
    },
    onError: () => toast.error("Código incorrecto o error al activar MFA"),
  });

  const verifyMfaLoginMutation = useMutation({
    mutationFn: async ({ challengeId, code }: { challengeId: string; code: string }) => {
      await verifyMfaChallenge(challengeId, code);
      return await account.get();
    },
    onSuccess: (userData) => {
      toast.success("Autenticación MFA exitosa");
      setIsMfaRequired(false);
      setMfaChallengeId("");
      setTotpCode("");
      queryClient.setQueryData(["user"], userData);
    },
    onError: async () => {
      toast.error("Código MFA incorrecto");
      // Limpiar la sesión parcial si el código es incorrecto
      try {
        await account.deleteSession({ sessionId: "current" });
      } catch (e) {
        // Ignorar errores al eliminar sesión
      }
      // Resetear el estado MFA para que el usuario pueda intentar de nuevo
      setIsMfaRequired(false);
      setMfaChallengeId("");
      setTotpCode("");
    },
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
  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => deleteTopic(topicId),
    onSuccess: () => {
      toast.success("Semestre eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: () => toast.error("Error al eliminar el semestre"),
  });

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
  const handleCreateCourse = (e: FormEvent, topicId: string) => {
    e.preventDefault();
    createCourseMutation.mutate(topicId);
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
    isMfaRequired,
    setIsMfaRequired,
    mfaChallengeId,
    setMfaChallengeId,
    totpCode,
    setTotpCode,
    recoveryCodes,
    setRecoveryCodes,
    qrUri,
    setQrUri,
    mfaSetupStep,
    setMfaSetupStep,
    user,
    isUserLoading,
    topics,
    courses,
    files,
    videos,
    loginMutation,
    logoutMutation,
    verifyMfaLoginMutation,
    generateRecoveryCodesMutation,
    setupTotpMutation,
    verifyAndEnableMfaMutation,
    createCourseMutation,
    createTopicMutation,
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
    deleteTopicMutation,
  };
};
