import { Account, Client, Databases, Query } from "appwrite";

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

client
  .setEndpoint(appwriteConfig.endpoint!) // Your API Endpoint
  .setProject(appwriteConfig.projectId!); // Your project ID

export const databases = new Databases(client);

//-- Funciones para interactuar con la base de datos -//
//-- CREATE --//
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

export const account = new Account(client);
export { ID } from "appwrite";
