import React from "react";
import type { ProfileData, SocialLink } from "../types";
import { Instagram, ShoppingBag, Mail } from "lucide-react";
import { TikTokIcon } from "../components/icons/TikTokIcon";

export const profileData: ProfileData = {
  name: "Roxy Macedo",
  bio: "Whisking up happiness one batch at a time 🍰 | Home Baker & Recipe Creator",
  avatarUrl: "/roxy.webp",
};

export const links: SocialLink[] = [
  {
    id: "tiktok",
    title: "TikTok",
    url: "https://www.tiktok.com/@roxymsolis",
    category: "social",
    icon: <TikTokIcon size={20} />,
  },
  {
    id: "instagram",
    title: "Instagram",
    url: "https://www.instagram.com/roxymsolis",
    category: "social",
    icon: <Instagram size={20} />,
  },
  {
    id: "shop",
    title: "Amazon Shop",
    url: "https://www.amazon.com/",
    category: "shop",
    icon: <ShoppingBag size={20} />,
  },
  {
    id: "email",
    title: "Email",
    url: "mailto:macedo.roxanna@yahoo.com",
    category: "social",
    icon: <Mail size={20} />,
  },
];
