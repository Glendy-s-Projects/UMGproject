"use client";
import { useEffect, Suspense, useState } from "react";
import { useAdmin } from "../../../lib/useAdmin";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/context/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "@/components/AppLayout";
import { QRCodeSVG } from "qrcode.react";
import CursosAdmin from "./cursos";
import { TopicData, AppwriteMfaError } from "../types";
import { MFALogin } from "./mfalogin";
import Mainsection from "./mainsection";

// Definimos la estructura de los datos que vienen de la base de datos

const AdminPanelContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTopicId = searchParams.get("topicId");

  const {
    email,
    setEmail,
    password,
    setPassword,
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
    loginMutation,
    logoutMutation,
    isMfaRequired,
    mfaChallengeId,
    totpCode,
    setTotpCode,
    recoveryCodes,
    qrUri,
    mfaSetupStep,
    setMfaSetupStep,
    verifyMfaLoginMutation,
    generateRecoveryCodesMutation,
    setupTotpMutation,
    verifyAndEnableMfaMutation,
    createTopicMutation,
    createCourseMutation,
    courseName,
    setCourseName,
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
    deleteCourseMutation,
    deleteVideoMutation,
    deleteFileMutation,
    deleteTopicMutation,
  } = useAdmin(activeTopicId);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isMfaDialogOpen, setIsMfaDialogOpen] = useState(false);
  const [savedCodes, setSavedCodes] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => {} });

  useEffect(() => {
    if (user && topics && topics.length > 0 && !activeTopicId) {
      router.replace(`?topicId=${topics[0].$id}`);
    } else if (!isUserLoading && !user && activeTopicId) {
      router.replace("/admin");
    }
  }, [user, isUserLoading, topics, activeTopicId, router]);

  const activeTopic = topics?.find((t: TopicData) => t.$id === activeTopicId);

  useEffect(() => {
    const savedCreds = localStorage.getItem("adminCreds");
    if (savedCreds) {
      try {
        const { savedEmail, savedPassword } = JSON.parse(savedCreds);
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      } catch (e) {
        console.error("Error al cargar credenciales guardadas", e);
      }
    }
  }, [setEmail, setPassword]);

  const confirmAction = (
    title: string,
    description: string,
    action: () => void,
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      onConfirm: action,
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
        Cargando sesión...
      </div>
    );
  }

  // Si el usuario ya está autenticado completamente
  if (user) {
    return (
      <AppLayout
        title="Panel de Administración"
        activeTopicId={activeTopicId}
        customTopics={topics}
        isAdmin={true}
        onLogout={() => logoutMutation.mutate()}
        isLogoutPending={logoutMutation.isPending}
        onTopicSelectOverride={(id) => router.push(`?topicId=${id}`)}
        onCreateTopic={() => {
          setIsTopicDialogOpen(true);
        }}
        breadcrumbs={[{ label: "Panel de Administración", href: "/admin" }]}
        headerRightContent={
          <div className="flex items-center space-x-4">
            {user.mfa ? (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">
                MFA Activo
              </span>
            ) : (
              <button
                onClick={() => setIsMfaDialogOpen(true)}
                className="text-xs bg-surface-container-high hover:bg-surface-dim px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors"
              >
                Activar MFA
              </button>
            )}
            <div className="text-neutral-900 dark:text-neutral-50 scale-95 transition-transform duration-150 font-bold">
              {user.name}
            </div>
          </div>
        }
      >
        <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-screen-xl w-full mx-auto">
          <Mainsection
            activeTopic={activeTopic}
            topics={topics}
            editingTopicId={editingTopicId}
            setEditingTopicId={setEditingTopicId}
            editTopicName={editTopicName}
            setEditTopicName={setEditTopicName}
            updateTopicMutation={updateTopicMutation}
            deleteTopicMutation={deleteTopicMutation}
            confirmAction={confirmAction}
            setIsCourseDialogOpen={setIsCourseDialogOpen}
            router={router}
          />
          <CursosAdmin
            activeTopic={activeTopic || null}
            topics={topics}
            editingCourseId={editingCourseId}
            setEditingCourseId={setEditingCourseId}
            editCourseName={editCourseName}
            setEditCourseName={setEditCourseName}
            updateCourseMutation={updateCourseMutation}
            deleteCourseMutation={deleteCourseMutation}
            activeVideoCourseId={activeVideoCourseId}
            setActiveVideoCourseId={setActiveVideoCourseId}
            activeFileCourseId={activeFileCourseId}
            setActiveFileCourseId={setActiveFileCourseId}
            setEditingTopicId={setEditingTopicId}
            editTopicName={editTopicName}
            setEditTopicName={setEditTopicName}
            updateTopicMutation={updateTopicMutation}
            deleteTopicMutation={deleteTopicMutation}
            confirmAction={confirmAction}
            handleCreateVideo={handleCreateVideo}
            createVideoMutation={createVideoMutation}
            editingVideoId={editingVideoId}
            setEditingVideoId={setEditingVideoId}
            editVideoName={editVideoName}
            setEditVideoName={setEditVideoName}
            editYoutubeCode={editYoutubeCode}
            setEditYoutubeCode={setEditYoutubeCode}
            updateVideoMutation={updateVideoMutation}
            deleteVideoMutation={deleteVideoMutation}
            handleCreateFile={handleCreateFile}
            createFileMutation={createFileMutation}
            editingFileId={editingFileId}
            setEditingFileId={setEditingFileId}
            editFileName={editFileName}
            setEditFileName={setEditFileName}
            editFileRoute={editFileRoute}
            setEditFileRoute={setEditFileRoute}
            updateFileMutation={updateFileMutation}
            deleteFileMutation={deleteFileMutation}
            videoName={videoName}
            setVideoName={setVideoName}
            youtubeCode={youtubeCode}
            setYoutubeCode={setYoutubeCode}
            fileName={fileName}
            setFileName={setFileName}
            fileRoute={fileRoute}
            setFileRoute={setFileRoute}
          />
        </main>

        <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                Nuevo Semestre
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <input
                type="text"
                placeholder="Nombre del semestre"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsTopicDialogOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newTopicName.trim() !== "") {
                      createTopicMutation.mutate(newTopicName.trim(), {
                        onSuccess: () => {
                          setIsTopicDialogOpen(false);
                          setNewTopicName("");
                        },
                      });
                    }
                  }}
                  disabled={createTopicMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  {createTopicMutation.isPending ? "Guardando..." : "Crear"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                Agregar Nuevo Curso
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCourseMutation.mutate(activeTopic?.$id || "", {
                  onSuccess: () => {
                    setIsCourseDialogOpen(false);
                    setCourseName("");
                  },
                });
              }}
              className="flex flex-col gap-4 py-4"
            >
              <input
                type="text"
                placeholder="Nombre del curso"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseDialogOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createCourseMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  {createCourseMutation.isPending
                    ? "Guardando..."
                    : "Agregar Curso"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración MFA */}
        <Dialog
          open={isMfaDialogOpen}
          onOpenChange={(open) => {
            setIsMfaDialogOpen(open);
            if (!open) {
              setMfaSetupStep(0);
              setSavedCodes(false);
              setTotpCode("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                Autenticación de Dos Pasos
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {mfaSetupStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-on-surface-variant">
                    La autenticación de dos pasos añade una capa extra de
                    seguridad a tu cuenta. Necesitaremos generar códigos de
                    recuperación antes de continuar.
                  </p>
                  <button
                    onClick={() => {
                      generateRecoveryCodesMutation.mutate(undefined, {
                        onSuccess: () => setMfaSetupStep(1),
                        onError: (error: unknown) => {
                          const mfaError = error as AppwriteMfaError;
                          // Si ya existen códigos, generar QR directamente
                          if (
                            mfaError?.code === 409 ||
                            mfaError?.skipRecovery
                          ) {
                            toast.info(
                              "Ya tienes códigos de recuperación. Generando código QR...",
                            );
                            setupTotpMutation.mutate(undefined, {
                              onSuccess: () => setMfaSetupStep(2),
                            });
                          }
                        },
                      });
                    }}
                    disabled={
                      generateRecoveryCodesMutation.isPending ||
                      setupTotpMutation.isPending
                    }
                    className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                  >
                    {generateRecoveryCodesMutation.isPending ||
                    setupTotpMutation.isPending
                      ? "Generando..."
                      : "Generar Códigos de Recuperación"}
                  </button>
                </div>
              )}

              {mfaSetupStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-destructive font-bold">
                    ¡Guarda estos códigos en un lugar seguro! Son la única forma
                    de recuperar tu cuenta si pierdes acceso a tu dispositivo.
                  </p>
                  <div className="bg-surface-container p-4 rounded-xl font-mono text-sm grid grid-cols-2 gap-2 text-center">
                    {recoveryCodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="bg-surface-container-high py-1 rounded"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="savedCodes"
                      checked={savedCodes}
                      onChange={(e) => setSavedCodes(e.target.checked)}
                      className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary transition-all cursor-pointer"
                    />
                    <label
                      htmlFor="savedCodes"
                      className="text-sm cursor-pointer select-none"
                    >
                      He guardado mis códigos de recuperación
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      setupTotpMutation.mutate(undefined, {
                        onSuccess: () => setMfaSetupStep(2),
                      });
                    }}
                    disabled={!savedCodes || setupTotpMutation.isPending}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {setupTotpMutation.isPending ? "Cargando..." : "Continuar"}
                  </button>
                </div>
              )}

              {mfaSetupStep === 2 && (
                <div className="space-y-4 flex flex-col items-center">
                  <p className="text-sm text-on-surface-variant text-center">
                    Escanea este código QR con tu aplicación de autenticación
                    (Google Authenticator, Authy, etc).
                  </p>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    {qrUri && <QRCodeSVG value={qrUri} size={200} />}
                  </div>
                  <input
                    type="text"
                    placeholder="Código de 6 dígitos"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    maxLength={6}
                    className="w-full p-3 text-center text-2xl tracking-widest border border-outline-variant bg-surface-container-lowest text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => {
                      verifyAndEnableMfaMutation.mutate(totpCode, {
                        onSuccess: () => {
                          setIsMfaDialogOpen(false);
                          setTotpCode("");
                          setMfaSetupStep(0);
                        },
                      });
                    }}
                    disabled={
                      totpCode.length < 6 ||
                      verifyAndEnableMfaMutation.isPending
                    }
                    className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold text-sm uppercase transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyAndEnableMfaMutation.isPending
                      ? "Verificando..."
                      : "Verificar y Activar"}
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación general para eliminar */}
        <Dialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-on-surface">
                {confirmDialog.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <p className="text-on-surface-variant font-medium">
                {confirmDialog.description}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                  }
                  className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-dim rounded-md font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md font-bold text-sm uppercase transition-colors shadow"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  }

  // Si no hay usuario, mostrar formulario de login o MFA
  return (
    <MFALogin
      isMfaRequired={isMfaRequired}
      mfaChallengeId={mfaChallengeId}
      totpCode={totpCode}
      setTotpCode={setTotpCode}
      verifyMfaLoginMutation={verifyMfaLoginMutation}
      loginMutation={loginMutation}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
    />
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
          Cargando Panel...
        </div>
      }
    >
      <AdminPanelContent />
    </Suspense>
  );
};

export default LoginPage;
