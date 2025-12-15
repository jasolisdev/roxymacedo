import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

type FeaturedCardProps = {
  to: string;
  badge?: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  cta: string;
};

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  to,
  badge = "FEATURED",
  title,
  description,
  imageUrl,
  imageAlt,
  cta,
}) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  return (
    <Link to={to} className="w-full max-w-md mb-6 group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border-2 border-sage/50 transition-all duration-300 hover:shadow-xl hover:border-sage hover:-translate-y-1">
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sage-dark shadow-sm flex items-center gap-1 z-10">
          <Star size={12} fill="currentColor" />
          <span>{badge}</span>
        </div>

        <div className="h-48 overflow-hidden relative">
          <div
            className={[
              "absolute inset-0 bg-gray-200 transition-opacity duration-500",
              isImageLoaded ? "opacity-0" : "opacity-100 animate-pulse",
            ].join(" ")}
          />
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <img
              src={imageUrl}
              alt={imageAlt}
              className={[
                "w-full h-full object-cover kenburns-featured transition-opacity duration-700",
                "motion-reduce:transition-none",
                isImageLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
              loading="eager"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-5 relative">
          <h3 className="font-script text-3xl text-baker-brown mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

          <div className="flex items-center text-rose-500 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
            {cta} <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};
