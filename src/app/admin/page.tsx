"use client";
import { useAdmin } from "../../../lib/useAdmin";

const LoginPage = () => {
  const {
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
  } = useAdmin();


  if (isUserLoading) {
    return <>Cargando sesion</>;
  }

  if (user) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div>
            <span className="mr-4">Bienvenido, {user.name}</span>
            <button
              onClick={() => logoutMutation.mutate()}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Cerrando" : "Cerrar Sesion"}
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
                disabled={createCourseMutation.isPending}
              >
                {createCourseMutation.isPending
                  ? "Agregando..."
                  : "Agregar Curso"}
              </button>
            </form>
          </div>

          {/* Lista dinámica de Semestres, Cursos, Videos y Archivos */}
          <div className="md:col-span-3 mt-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Contenido Actual
            </h2>
            <div className="space-y-6">
              {topics.map((topic) => (
                <div
                  key={topic.$id}
                  className="border p-6 rounded-lg bg-gray-50"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingTopicId === topic.$id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTopicName}
                          onChange={(e) => setEditTopicName(e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                        <button
                          onClick={() =>
                            updateTopicMutation.mutate({
                              topicId: topic.$id,
                              newSemesterName: editTopicName,
                            })
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Guardar
                        </button>
                        <button onClick={() => setEditingTopicId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="">
                        <p>{topic.semester}</p>
                        <button onClick={() => {
                          setEditingTopicId(topic.$id);
                          setEditTopicName(topic.semester);
                        }}>
                          Editar
                        </button>
                      </div>
                    )}

                  </h3>

                  <div className="mt-4 space-y-4">
                    {/* @ts-ignore - 'course' viene anidado desde Appwrite */}
                    {topic.course?.map((course: any) => (
                      <div
                        key={course.$id}
                        className="bg-white p-4 rounded border shadow-sm"
                      >
                        <h4 className="font-bold text-lg text-blue-600">
                          {course.course}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {/* Renderizar Videos del Curso */}
                          <div>
                            <div className="flex justify-between items-center border-b pb-1 mb-2">
                              <h5 className="font-semibold text-gray-700">
                                Videos
                              </h5>
                              <button
                                onClick={() =>
                                  setActiveVideoCourseId(
                                    activeVideoCourseId === course.$id
                                      ? null
                                      : course.$id,
                                  )
                                }
                                className="text-blue-500 hover:bg-blue-100 px-2 rounded font-bold"
                              >
                                {activeVideoCourseId === course.$id ? "-" : "+"}
                              </button>
                            </div>

                            {/* Acordeón: Formulario Inline para Videos */}
                            {activeVideoCourseId === course.$id && (
                              <form
                                onSubmit={(e) =>
                                  handleCreateVideo(e, course.$id)
                                }
                                className="space-y-2 mb-4 bg-blue-50 p-2 rounded"
                              >
                                <input
                                  type="text"
                                  placeholder="Nombre del video"
                                  value={videoName}
                                  onChange={(e) => setVideoName(e.target.value)}
                                  className="w-full p-1 text-sm border rounded"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Código de YouTube"
                                  value={youtubeCode}
                                  onChange={(e) =>
                                    setYoutubeCode(e.target.value)
                                  }
                                  className="w-full p-1 text-sm border rounded"
                                  required
                                />
                                <button
                                  type="submit"
                                  disabled={createVideoMutation.isPending}
                                  className="w-full bg-blue-500 text-white p-1 text-sm rounded"
                                >
                                  {createVideoMutation.isPending
                                    ? "Guardando..."
                                    : "Guardar"}
                                </button>
                              </form>
                            )}

                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {videos
                                .filter((v: any) => v.courseId === course.$id)
                                .map((video: any) => (
                                  <li key={video.$id}>{video.name}</li>
                                ))}
                            </ul>
                          </div>

                          {/* Renderizar Archivos del Curso */}
                          <div>
                            <div className="flex justify-between items-center border-b pb-1 mb-2">
                              <h5 className="font-semibold text-gray-700">
                                Archivos
                              </h5>
                              <button
                                onClick={() =>
                                  setActiveFileCourseId(
                                    activeFileCourseId === course.$id
                                      ? null
                                      : course.$id,
                                  )
                                }
                                className="text-green-500 hover:bg-green-100 px-2 rounded font-bold"
                              >
                                {activeFileCourseId === course.$id ? "-" : "+"}
                              </button>
                            </div>

                            {/* Acordeón: Formulario Inline para Archivos */}
                            {activeFileCourseId === course.$id && (
                              <form
                                onSubmit={(e) =>
                                  handleCreateFile(e, course.$id)
                                }
                                className="space-y-2 mb-4 bg-green-50 p-2 rounded"
                              >
                                <input
                                  type="text"
                                  placeholder="Nombre del archivo"
                                  value={fileName}
                                  onChange={(e) => setFileName(e.target.value)}
                                  className="w-full p-1 text-sm border rounded"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="URL del archivo"
                                  value={fileRoute}
                                  onChange={(e) => setFileRoute(e.target.value)}
                                  className="w-full p-1 text-sm border rounded"
                                  required
                                />
                                <button
                                  type="submit"
                                  disabled={createFileMutation.isPending}
                                  className="w-full bg-green-500 text-white p-1 text-sm rounded"
                                >
                                  {createFileMutation.isPending
                                    ? "Guardando..."
                                    : "Guardar"}
                                </button>
                              </form>
                            )}

                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {files
                                .filter((f: any) => f.courseId === course.$id)
                                .map((file: any) => (
                                  <li key={file.$id}>{file.name}</li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
            onClick={() => loginMutation.mutate()}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesion"}
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
