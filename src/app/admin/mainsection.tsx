import React from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { TopicData } from "../types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseMutationResult } from "@tanstack/react-query";
import { Models } from "appwrite";

interface MainSectionProps {
  activeTopic: TopicData | undefined;
  topics: TopicData[];
  editingTopicId: string | null;
  setEditingTopicId: React.Dispatch<React.SetStateAction<string | null>>;
  editTopicName: string;
  setEditTopicName: React.Dispatch<React.SetStateAction<string>>;
  updateTopicMutation: UseMutationResult<Models.Document, Error, { topicId: string; newSemesterName: string }, unknown>;
  deleteTopicMutation: UseMutationResult<Record<string, never>, Error, string, unknown>;
  confirmAction: (title: string, description: string, action: () => void) => void;
  setIsCourseDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
}

const Mainsection = ({
  activeTopic,
  editingTopicId,
  setEditingTopicId,
  editTopicName,
  setEditTopicName,
  updateTopicMutation,
  deleteTopicMutation,
  confirmAction,
  setIsCourseDialogOpen,
  router
}: MainSectionProps) => {
  return (
    <section className=" flex flex-col items-start gap-6">
      <div className="w-full flex justify-between items-end border-b-2 border-outline-variant/30 pb-2">
        <div className="space-y-1 w-full max-w-3xl ">
          {activeTopic && editingTopicId === activeTopic.$id ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">
              <input
                type="text"
                value={editTopicName}
                onChange={(e) => setEditTopicName(e.target.value)}
                className="w-full text-[2.5rem] md:text-[3.5rem] font-black leading-[0.9] tracking-tighter text-on-surface bg-transparent border-b-4 border-primary focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() =>
                    updateTopicMutation.mutate({
                      topicId: activeTopic.$id,
                      newSemesterName: editTopicName,
                    })
                  }
                  disabled={updateTopicMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                >
                  {updateTopicMutation.isPending ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => setEditingTopicId(null)}
                  className="bg-surface-container-highest hover:bg-surface-dim text-on-surface px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-[2.5rem] pb-6 font-black leading-[0.9] tracking-tighter text-on-surface">
              {activeTopic?.semester || "Seleccionar Semestre"}
            </h1>
          )}
        </div>
        {!editingTopicId && activeTopic && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditingTopicId(activeTopic.$id);
                setEditTopicName(activeTopic.semester);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-dim transition-colors text-on-surface text-sm font-bold uppercase tracking-wider rounded-md"
            >
              <span className="material-symbols-outlined text-sm">
                <FaEdit />
              </span>
            </button>
            <button
              onClick={() => setIsCourseDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold uppercase tracking-wider rounded-md"
              title="Agregar Nuevo Curso"
            >
              <IoIosAdd size={20} />
            </button>
            <button
              onClick={() => {
                confirmAction(
                  "Eliminar Semestre",
                  "¿Estás seguro de que deseas eliminar este semestre por completo? Esta acción no se puede deshacer y borrará todos los cursos dentro de él.",
                  () => {
                    deleteTopicMutation.mutate(activeTopic.$id, {
                      onSuccess: () => router.replace("/admin"),
                    });
                  },
                );
              }}
              disabled={deleteTopicMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 transition-colors text-destructive-foreground text-sm font-bold uppercase tracking-wider rounded-md"
              title="Eliminar Semestre"
            >
              <MdDeleteOutline size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Mainsection;
