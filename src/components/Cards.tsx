import Image from "next/image";
import Link from "next/link";
import React from "react";

const Cards = ({
  optionCards,
}: {
  optionCards: {
    id: number;
    name: string;
    image: string;
    mainroute?: string;
    href?: string;
    bgColor?: string;
  }[];
}) => {
  return (
    <div className="flex flex-wrap max-sm:flex-col items-center justify-center gap-2 mt-2">
      {optionCards.map((route) => (
        <Link
          key={route.id}
          href={route.mainroute || route.href || "#"}
          className="w-auto max-sm:w-full h-auto text-center "
        >
          <Image
            src={route.image}
            alt={route.name}
            width={200}
            height={100}
            className="rounded-t-lg  transition-transform transform h-44 w-96 object-cover "
          />
          <div
            className={` flex flex-col py-2 rounded-b-lg ${
              route.bgColor || "bg-blue-500"
            }  `}
          >
            <h1 className=" font-extrabold text-2xl  ">{route.name}</h1>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cards;
