import React from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../content/blog";
import { isSanityConfigured, sanityQuery } from "../services/sanity";
import { BLOG_INDEX_QUERY } from "../services/sanityQueries";
import type { CmsFeaturedPost } from "../services/sanityTypes";

export const BlogIndexPage: React.FC = () => {
  const remoteEnabled = isSanityConfigured();
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(remoteEnabled ? "loading" : "ready");
  const [posts, setPosts] = React.useState<CmsFeaturedPost[] | null>(null);

  React.useEffect(() => {
    if (!remoteEnabled) return;

    let cancelled = false;
    const startedAt = Date.now();
    sanityQuery<CmsFeaturedPost[]>(BLOG_INDEX_QUERY)
      .then((result) => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const delayMs = Math.max(0, 250 - elapsed);
        window.setTimeout(() => {
          if (cancelled) return;
          setPosts(result ?? []);
          setStatus("ready");
        }, delayMs);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error("Sanity BLOG_INDEX_QUERY failed, falling back to local posts.", error);
        if (cancelled) return;
        setPosts(null);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [remoteEnabled]);

  const list = status === "ready" ? (posts ?? []) : blogPosts;
  const formatDate = (date?: string) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-2xl">
        <div className="mb-8">
          <Link to="/" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
            ← Home
          </Link>
          <h1 className="mt-4 text-4xl font-script font-bold text-baker-brown">Blog</h1>
          <p className="mt-2 text-gray-600">Updates, favorites, and announcements.</p>
        </div>

        <div className="grid gap-4">
          {status === "loading" ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-2 h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : null}

          {status === "error" ? (
            <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm text-gray-600 text-sm">
              Couldn’t load posts right now. Showing saved posts.
            </div>
          ) : null}

          {status !== "loading"
            ? list.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-rose-100 bg-white p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-down"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-rose-700 transition-colors">
                    {post.title}
                  </h2>
                  {post.date ? <p className="mt-1 text-sm text-gray-500">{formatDate(post.date)}</p> : null}
                  <p className="mt-3 text-gray-700 line-clamp-2">{post.excerpt}</p>
                </div>
                <span className="text-rose-400 font-bold">↗</span>
              </div>
            </Link>
          ))
            : null}
        </div>
      </main>
    </div>
  );
};
