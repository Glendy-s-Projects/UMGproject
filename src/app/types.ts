export interface CourseData {
  $id: string;
  course: string;
}

export interface VideoData {
  $id: string;
  name: string;
  youtubeCode: string;
  courseId: string;
}

export interface FileData {
  $id: string;
  name: string;
  fileRoute: string;
  courseId: string;
}

export interface TopicData {
  $id: string;
  semester: string;
}

export interface AppwriteMfaError {
  code?: number;
  skipRecovery?: boolean;
  message?: string;
}