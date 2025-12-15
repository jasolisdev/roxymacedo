export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  heroImageUrl?: string;
  content: Array<{ type: "p"; text: string }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome",
    title: "Welcome",
    date: "2025-12-15",
    excerpt: "A quick hello and what you can expect here.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=1600",
    content: [
      { type: "p", text: "Hi! I’m Roxy — welcome to my little home on the internet." },
      {
        type: "p",
        text: "I’ll post updates, favorites, and announcements here so everything stays in one place.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

