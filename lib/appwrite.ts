import { Account, Client, Databases, Query, AuthenticatorType, AuthenticationFactor } from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  projectName: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME,

  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  topicCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TOPIC_COLLECTION_ID,
  courseCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COURSE_COLLECTION_ID,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
  videosCollectionId: process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_COLLECTION_ID,
};

export const client = new Client();
export const account = new Account(client);
export { ID } from "appwrite";

client
  .setEndpoint(appwriteConfig.endpoint!) // Your API Endpoint
  .setProject(appwriteConfig.projectId!); // Your project ID

export const databases = new Databases(client);

//-- Funciones para interactuar con la base de datos -//
//-- CREATE --//
export const createTopic = async (semesterName: string) => {
  try {
    const topic = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.topicCollectionId!,
      "unique()",
      { semester: semesterName }
    );
    return topic;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
};

export const createVideo = async (
  name: string,
  youtubeCode: string,
  courseId: string
) => {
  try {
    const video = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      "unique()",
      { name, youtubeCode, courseId }
    );
    return video;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};

export const createFile = async (
  name: string,
  fileRoute: string,
  courseId: string
) => {
  try {
    const file = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      "unique()",
      { name, fileRoute, courseId }
    );
    return file;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const createCourse = async (
  course: string,
  topicId: string,
  bgColor?: string
) => {
  try {
    const newCourse = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      "unique()",
      { course, bgColor: bgColor || null, topicId }
    );
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

//-- READ --//
export const getTopics = async () => {
  try {
    const topics = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.topicCollectionId!,
      [Query.limit(100)]
    );

    if (topics.documents.length > 0) {
      return topics.documents;
    }
    return null;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

export const getCourses = async (topicId: string) => {
  try {
    const courses = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      [Query.equal("topicId", topicId), Query.limit(100)]
    );

    if (courses.documents.length > 0) {
      return courses.documents;
    }
    return null;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getFiles = async (courseIds: string[]) => {
  if (!courseIds || courseIds.length === 0) return [];
  try {
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      [Query.equal("courseId", courseIds), Query.limit(500)]
    );

    if (files.documents.length > 0) {
      return files.documents;
    }
    return null;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const getVideos = async (courseIds: string[]) => {
  if (!courseIds || courseIds.length === 0) return [];
  try {
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      [Query.equal("courseId", courseIds), Query.limit(500)]
    );

    if (videos.documents.length > 0) {
      return videos.documents;
    }
    return null;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const getCourseByName = async (courseName: string) => {
  try {
    // 1. Buscar el curso por nombre
    const courses = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      [Query.equal("course", courseName)]
    );

    if (courses.documents.length === 0) {
      return null;
    }

    const course = courses.documents[0];

    // 2. Obtener videos del curso
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      [Query.equal("courseId", course.$id), Query.limit(500)]
    );

    // 3. Obtener archivos del curso
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      [Query.equal("courseId", course.$id), Query.limit(500)]
    );

    return {
      ...course,
      videos: videos.documents,
      files: files.documents,
    };
  } catch (error) {
    console.error("Error fetching course by name:", error);
    throw error;
  }
};

//-- UPDATE --//
export const updateTopic = async (topicId: string, newSemesterName: string) => {
  try {
    const updatedTopic = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.topicCollectionId!,
      topicId,
      { semester: newSemesterName }
    );
    return updatedTopic;
  } catch (error) {
    console.error("Error updating topic:", error);
    throw error;
  }
};

export const updateCourse = async (courseId: string, newCourseName: string) => {
  try {
    const updatedCourse = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      courseId,
      { course: newCourseName }
    );
    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const updateVideo = async (
  videoId: string,
  newVideoName: string,
  newYoutubeCode: string
) => {
  try {
    const updatedVideo = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      videoId,
      { name: newVideoName, youtubeCode: newYoutubeCode }
    );
    return updatedVideo;
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
};

export const updateFile = async (
  fileId: string,
  newFileName: string,
  newFileRoute: string
) => {
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      fileId,
      {
        name: newFileName,
        fileRoute: newFileRoute,
      }
    );
    return updatedFile;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

//-- DELETE --//
export const deleteTopic = async (topicId: string) => {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.topicCollectionId!,
      topicId
    );
    return result;
  } catch (error) {
    console.error("Error deleting topic:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      courseId
    );
    return result;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

export const deleteVideo = async (videoId: string) => {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      videoId
    );
    return result;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      fileId
    );
    return result;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

//-- Funciones para MFA (Multi-Factor Authentication) --//

/**
 * Genera un nuevo set de códigos de recuperación para el usuario autenticado.
 */
export const createRecoveryCodes = async () => {
  try {
    return await account.createMfaRecoveryCodes();
  } catch (error) {
    console.error("Error al generar códigos de recuperación:", error);
    throw error;
  }
};

/**
 * Regenera los códigos de recuperación (invalida los anteriores).
 */
export const regenerateRecoveryCodes = async () => {
  try {
    return await account.updateMfaRecoveryCodes();
  } catch (error) {
    console.error("Error al regenerar códigos de recuperación:", error);
    throw error;
  }
};

/**
 * Inicia el proceso de configuración de TOTP (ej. Google Authenticator).
 * Retorna un objeto que incluye una URI para generar un código QR.
 */
export const setupTotp = async () => {
  try {
    return await account.createMfaAuthenticator(AuthenticatorType.Totp);
  } catch (error) {
    console.error("Error al iniciar la configuración de TOTP:", error);
    throw error;
  }
};

/**
 * Verifica el código TOTP proporcionado por el usuario para completar la configuración.
 * @param code El código de 6 dígitos de la app de autenticación.
 */
export const verifyTotpSetup = async (code: string) => {
  try {
    return await account.updateMfaAuthenticator(AuthenticatorType.Totp, code);
  } catch (error) {
    console.error("Error al verificar el código TOTP:", error);
    throw error;
  }
};

/**
 * Activa MFA para la cuenta del usuario. Debe llamarse después de una configuración exitosa.
 */
export const enableMfa = async () => {
  try {
    return await account.updateMFA(true);
  } catch (error) {
    console.error("Error al activar MFA:", error);
    throw error;
  }
};

/**
 * Crea un desafío MFA para el proceso de login. Se usa cuando una acción
 * requiere un segundo factor de autenticación.
 */
export const createMfaChallenge = async () => {
  try {
    return await account.createMfaChallenge(AuthenticationFactor.Totp);
  } catch (error) {
    console.error("Error al crear el desafío MFA:", error);
    throw error;
  }
};

/**
 * Verifica un desafío MFA para completar el proceso de login.
 * @param challengeId El ID del desafío obtenido del paso anterior.
 * @param code El código TOTP del usuario.
 */
export const verifyMfaChallenge = async (challengeId: string, code: string) => {
  try {
    return await account.updateMfaChallenge(challengeId, code);
  } catch (error) {
    console.error("Error al verificar el desafío MFA:", error);
    throw error;
  }
};
