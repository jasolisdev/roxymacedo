import React from "react";
import type { SocialLink } from "../types";
import { ExternalLink } from "lucide-react";

interface LinkButtonProps {
  link: SocialLink;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ link }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full max-w-md transform transition-all hover:-translate-y-1"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-100 to-sage opacity-50 group-hover:opacity-100 rounded-xl blur transition duration-200" />
      <div className="relative flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-rose-50 hover:border-rose-200 transition-colors">
        <div className="flex items-center gap-3">
          {link.icon ? (
            <span className="text-rose-400 group-hover:text-rose-500 transition-colors">
              {link.icon}
            </span>
          ) : null}
          <span className="font-sans font-semibold text-gray-700 group-hover:text-rose-600 transition-colors">
            {link.title}
          </span>
        </div>
        <ExternalLink size={16} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
      </div>
    </a>
  );
};

