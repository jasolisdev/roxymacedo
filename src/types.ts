import type { ReactNode } from "react";

export type LinkCategory = "social" | "shop" | "recipe";

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon?: ReactNode;
  category: LinkCategory;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
}

export enum RecipeTone {
  SWEET = "sweet",
  SAVORY = "savory",
  HEALTHY = "healthy",
}

