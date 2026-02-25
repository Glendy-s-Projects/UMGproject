"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  account,
  ID,
  getTopics,
  getCourses,
  createCourse,
  createVideo,
  createFile,
} from "../../../lib/appwrite";
import { Models } from "appwrite";
import { Topic, Course } from "../../../type";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Estados para cursos
  const [courseName, setCourseName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Estados para videos
  const [videoName, setVideoName] = useState("");
  const [youtubeCode, setYoutubeCode] = useState("");
  const [selectedCourseVideo, setSelectedCourseVideo] = useState("");

  // Estados para archivos
  const [fileName, setFileName] = useState("");
  const [fileRoute, setFileRoute] = useState("");
  const [selectedCourseFile, setSelectedCourseFile] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setLoggedInUser(user);
      } catch (error) {
        setLoggedInUser(null);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const topicsData = await getTopics();
      const coursesData = await getCourses();
      setTopics((topicsData || []) as unknown as Topic[]);
      setCourses((coursesData || []) as unknown as Course[]);
    };
    if (loggedInUser) fetchData();
  }, [loggedInUser]);

  const login = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession({
        email,
        password,
      });
      setLoggedInUser(await account.get());
    } catch (error) {
      alert("Error al iniciar sesión");
    }
  };

  // const register = async () => {
  //   await account.create({
  //     userId: ID.unique(),
  //     email,
  //     password,
  //     name,
  //   });
  //   login(email, password);
  // };

  const logout = async () => {
    await account.deleteSession({ sessionId: "current" });
    setLoggedInUser(null);
  };

  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createCourse(courseName, selectedTopic);
      alert("Curso agregado exitosamente");
      setCourseName("");
      const coursesData = await getCourses();
      setCourses((coursesData || []) as unknown as Course[]);
    } catch (error) {
      alert("Error al agregar curso");
    }
  };

  const handleCreateVideo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createVideo(videoName, youtubeCode, selectedCourseVideo);
      alert("Video agregado exitosamente");
      setVideoName("");
      setYoutubeCode("");
    } catch (error) {
      alert("Error al agregar video");
    }
  };

  const handleCreateFile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createFile(fileName, fileRoute, selectedCourseFile);
      alert("Archivo agregado exitosamente");
      setFileName("");
      setFileRoute("");
    } catch (error) {
      alert("Error al agregar archivo");
    }
  };

  if (loggedInUser) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div>
            <span className="mr-4">Bienvenido, {loggedInUser.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulario para agregar cursos */}
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Curso</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar Semestre</option>
                {topics.map((topic) => (
                  <option key={topic.$id} value={topic.$id}>
                    {topic.semester}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nombre del curso"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-500 text-white p-2 rounded"
              >
                Agregar Curso
              </button>
            </form>
          </div>

          {/* Formulario para agregar videos */}
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Video</h2>
            <form onSubmit={handleCreateVideo} className="space-y-4">
              <select
                value={selectedCourseVideo}
                onChange={(e) => setSelectedCourseVideo(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar Curso</option>
                {courses.map((course) => (
                  <option key={course.$id} value={course.$id}>
                    {course.course}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nombre del video"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Código de YouTube"
                value={youtubeCode}
                onChange={(e) => setYoutubeCode(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Agregar Video
              </button>
            </form>
          </div>

          {/* Formulario para agregar archivos */}
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Archivo</h2>
            <form onSubmit={handleCreateFile} className="space-y-4">
              <select
                value={selectedCourseFile}
                onChange={(e) => setSelectedCourseFile(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar Curso</option>
                {courses.map((course) => (
                  <option key={course.$id} value={course.$id}>
                    {course.course}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nombre del archivo"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="URL del archivo"
                value={fileRoute}
                onChange={(e) => setFileRoute(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded"
              >
                Agregar Archivo
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => login(email, password)}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Iniciar Sesión
          </button>
          {/* <button
            type="button"
            onClick={register}
            className="w-full bg-gray-500 text-white p-2 rounded"
          >
            Registrarse
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
