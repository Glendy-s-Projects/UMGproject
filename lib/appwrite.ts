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

export const getTopics = async () => {
  try {
    const topics = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.topicCollectionId!,
      [],
    );

    if (topics.documents.length > 0) {
      const topicsWithCourses = await Promise.all(
        topics.documents.map(async (topic) => {
          const courses = await databases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.courseCollectionId!,
            [Query.equal("topicId", topic.$id)],
          );
          return { ...topic, course: courses.documents };
        }),
      );
      return topicsWithCourses;
    }
    return null;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const courses = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      [],
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

export const getFiles = async () => {
  try {
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      [],
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

export const getVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      [],
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

export const createVideo = async (
  name: string,
  youtubeCode: string,
  courseId: string,
) => {
  try {
    const video = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      "unique()",
      { name, youtubeCode, courseId },
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
  courseId: string,
) => {
  try {
    const file = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      "unique()",
      { name, fileRoute, courseId },
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
  bgColor?: string,
) => {
  try {
    const newCourse = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      "unique()",
      { course, bgColor: bgColor || null, topicId },
    );
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const getCourseByName = async (courseName: string) => {
  try {
    // 1. Buscar el curso por nombre
    const courses = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.courseCollectionId!,
      [Query.equal("course", courseName)],
    );

    if (courses.documents.length === 0) {
      return null;
    }

    const course = courses.documents[0];

    // 2. Obtener videos del curso
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.videosCollectionId!,
      [Query.equal("courseId", course.$id)],
    );

    // 3. Obtener archivos del curso
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      [Query.equal("courseId", course.$id)],
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

export const account = new Account(client);
export { ID } from "appwrite";
