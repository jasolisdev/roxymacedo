import React from "react";
import { Instagram, Mail, ShoppingBag, Link as LinkIcon } from "lucide-react";
import { TikTokIcon } from "./TikTokIcon";

export type SocialIconName = "tiktok" | "instagram" | "shop" | "email" | "link";

export function getSocialIcon(icon: SocialIconName, size = 20) {
  if (icon === "tiktok") return <TikTokIcon size={size} />;
  if (icon === "instagram") return <Instagram size={size} />;
  if (icon === "shop") return <ShoppingBag size={size} />;
  if (icon === "email") return <Mail size={size} />;
  return <LinkIcon size={size} />;
}

