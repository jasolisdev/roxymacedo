import React from "react";
import type { ProfileData } from "../types";

interface ProfileHeaderProps {
  data: ProfileData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ data }) => {
  const initials = data.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex flex-col items-center text-center mb-8 animate-fade-in-down">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-rose-200 to-sage rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-baker-brown font-bold text-3xl tracking-widest">
              {initials || "RM"}
            </span>
          )}
        </div>
        <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md text-xl">
          👩‍🍳
        </div>
      </div>

      <h1 className="mt-4 text-3xl font-script font-bold text-baker-brown">{data.name}</h1>
      <p className="mt-2 text-rose-800 font-medium px-6 max-w-sm leading-relaxed">
        {data.bio}
      </p>
    </div>
  );
};
