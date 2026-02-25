import { Models } from "appwrite";

export interface FileData extends Models.Document {
  id: string;
  name: string;
  fileRoute: string;
  courseId: string;
}

export interface Video extends Models.Document {
  id: string;
  name: string;
  youtubeCode: string;
  courseId: string;
}

export interface Course extends Models.Document {
  id: string;
  course: string;
  bgColor: string;
  video: Video[];
  file: FileData[];
  topicId: string;
}

export interface Topic extends Models.Document {
  id: string;
  semester: string;
  bgColor: string;
  course: Course[];
}
