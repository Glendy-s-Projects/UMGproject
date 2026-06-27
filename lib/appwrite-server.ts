import { Client, Databases, Query } from "node-appwrite"; // <- node-appwrite

const createClient = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  return new Databases(client);
};

export const getTopics = async () => {
  try {
    const databases = createClient();
    const topics = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TOPIC_COLLECTION_ID!,
      [Query.limit(100)]
    );
    return topics.documents.length > 0 ? topics.documents : null;
  } catch (error) {
    console.error("Error fetching topics from Appwrite:", error);
    return null;
  }
};

export const getCourses = async (topicId: string) => {
  try {
    const databases = createClient();
    const courses = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COURSE_COLLECTION_ID!,
      [Query.equal("topicId", topicId), Query.limit(100)]
    );
    return courses.documents.length > 0 ? courses.documents : null;
  } catch (error) {
    console.error(`Error fetching courses for topic ${topicId}:`, error);
    return null;
  }
};