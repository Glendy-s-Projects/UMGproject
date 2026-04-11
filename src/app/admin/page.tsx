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
    createVideoMutation,
    createFileMutation,
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
    editingFileId,
    setEditingFileId,
    editFileName,
    setEditFileName,
    editFileRoute,
    setEditFileRoute,
    updateFileMutation,
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
                        <button
                          onClick={() => setEditingTopicId(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="">
                        <p>{topic.semester}</p>
                        <button
                          onClick={() => {
                            setEditingTopicId(topic.$id);
                            setEditTopicName(topic.semester);
                          }}
                        >
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
                        {editingCourseId === course.$id ? (
                          <div className="flex items-center space-x-2 mb-4">
                            <input
                              type="text"
                              value={editCourseName}
                              onChange={(e) =>
                                setEditCourseName(e.target.value)
                              }
                              className="w-full p-1 border rounded"
                            />
                            <button
                              onClick={() =>
                                updateCourseMutation.mutate({
                                  courseId: course.$id,
                                  newCourseName: editCourseName,
                                })
                              }
                              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingCourseId(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg text-blue-600">
                              {course.course}
                            </h4>
                            <button
                              onClick={() => {
                                setEditingCourseId(course.$id);
                                setEditCourseName(course.course);
                              }}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              Editar Curso
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
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
                                  <li key={video.$id} className="mb-2">
                                    {editingVideoId === video.$id ? (
                                      <div className="flex flex-col space-y-2 bg-blue-50 p-2 rounded mt-1 border">
                                        <input
                                          type="text"
                                          value={editVideoName}
                                          onChange={(e) =>
                                            setEditVideoName(e.target.value)
                                          }
                                          className="p-1 border rounded w-full text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={editYoutubeCode}
                                          onChange={(e) =>
                                            setEditYoutubeCode(e.target.value)
                                          }
                                          className="p-1 border rounded w-full text-xs"
                                        />
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              updateVideoMutation.mutate({
                                                videoId: video.$id,
                                                newVideoName: editVideoName,
                                                newYoutubeCode: editYoutubeCode,
                                              })
                                            }
                                            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                          >
                                            Guardar
                                          </button>
                                          <button
                                            onClick={() =>
                                              setEditingVideoId(null)
                                            }
                                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-center group">
                                        <span>{video.name}</span>
                                        <button
                                          onClick={() => {
                                            setEditingVideoId(video.$id);
                                            setEditVideoName(video.name);
                                            setEditYoutubeCode(
                                              video.youtubeCode,
                                            );
                                          }}
                                          className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          Editar
                                        </button>
                                      </div>
                                    )}
                                  </li>
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
                                  <li key={file.$id} className="mb-2">
                                    {editingFileId === file.$id ? (
                                      <div className="flex flex-col space-y-2 bg-blue-50 p-2 rounded mt-1 border">
                                        <input
                                          type="text"
                                          className="p-1 border rounded w-full text-xs"
                                          value={editFileName}
                                          onChange={(e) =>
                                            setEditFileName(e.target.value)
                                          }
                                        />
                                        <input
                                          type="text"
                                          className="p-1 border rounded w-full text-xs"
                                          value={editFileRoute}
                                          onChange={(e) =>
                                            setEditFileRoute(e.target.value)
                                          }
                                        />
                                        <div className="flex space-x-2">
                                          <button
                                            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                            onClick={() =>
                                              updateFileMutation.mutate({
                                                fileId: file.$id,
                                                newFileName: editFileName,
                                                newFileRoute: editFileRoute,
                                              })
                                            }
                                          >
                                            {" "}
                                            Guardar
                                          </button>
                                          <button
                                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                                            onClick={() =>
                                              setEditingFileId(null)
                                            }
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-center group">
                                        <span className="">{file.name} </span>
                                        <button
                                          className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => {
                                            setEditingFileId(file.$id);
                                            setEditFileName(file.name);
                                            setEditFileRoute(file.fileRoute);
                                          }}
                                        >
                                          Editar
                                        </button>
                                      </div>
                                    )}
                                  </li>
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
