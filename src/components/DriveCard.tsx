import React from "react";
import TitleCourse from "./TitleCourse";
import Image from "next/image";
import Link from "next/link";

interface DriveCardProps {
  driveFiles: {
    $id?: string;
    name?: string;
    fileRoute?: string;
  }[];
}

const DriveCard = ({ driveFiles }: DriveCardProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-4">
      <TitleCourse course="Archivos de Drive" />

      {driveFiles.length === 0 ? (
        <p className="text-gray-500">No hay archivos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {driveFiles.map((file) => (
            <Link
              key={file.$id}
              href={file.fileRoute || "#"}
              target="_blank"
              className="flex flex-col items-center gap-2 hover:underline p-4 border rounded-lg bg-white shadow-md"
            >
              <Image
                src="/drive.webp"
                alt="Drive Logo"
                width={150}
                height={150}
                style={{ filter: "drop-shadow(0 0 0.75rem #b2693b)" }}
              />
              <h2 className="font-bold text-center">{file.name}</h2>
              <span className="text-sm text-blue-600">Click para abrir</span>
            </Link>
          ))}
        </div>
      )}

      <span className="text-center text-gray-600 mt-4">
        Para tener acceso a los documentos, tienes que tener un correo
        institucional de la Universidad Mariano Galvez
      </span>
    </div>
  );
};

export default DriveCard;
