"use client";
import { SemesterRoutes } from "@/utils/data/routes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Estados para manejar los datos, la carga y los posibles errores

  return (
    <section className="min-h-screen flex flex-col items-center gap-2 p-4">
      <h1 className="text-center w-full text-2xl font-extrabold max-sm:text-xl">
        Ingeniería en Sistemas
      </h1>

      <div className="flex flex-col max-sm:flex-col items-center justify-center gap-6 mt-8">
        {SemesterRoutes.map((route) => (
          <Link
            key={route.id}
            href={route.mainroute}
            className="w-auto max-sm:w-full h-auto text-center "
          >
            <Image
              src={route.image}
              alt={route.name}
              width={200}
              height={100}
              className="rounded-t-lg  transition-transform transform h-44 w-96 object-cover "
            />
            <div className={` flex flex-col p-2 rounded-b-lg `}>
              <h1 className=" font-extrabold text-2xl ">{route.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
