export type CmsLink = {
  _key: string;
  title: string;
  url: string;
  category: "social" | "shop" | "recipe";
  icon: "tiktok" | "instagram" | "shop" | "email" | "link";
};

export type CmsFeaturedPost = {
  title: string;
  slug: string;
  excerpt: string;
  heroImageUrl?: string;
  date?: string;
};

export type CmsHomePage = {
  profileName: string;
  profileBio: string;
  profileAvatarUrl?: string;
  links: CmsLink[];
  featured?: CmsFeaturedPost;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonLabel?: string;
};

export type PortableTextSpan = {
  _key?: string;
  _type: "span";
  text: string;
  marks?: string[];
};

export type PortableTextMarkDef = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

export type PortableTextBlock = {
  _key?: string;
  _type: "block";
  style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
};

export type PortableTextImage = {
  _key?: string;
  _type: "image";
  alt?: string;
  url?: string;
};

export type CmsBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  heroImageUrl?: string;
  date?: string;
  body: Array<PortableTextBlock | PortableTextImage | Record<string, unknown>>;
};
