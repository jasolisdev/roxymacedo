import React from "react";
import { Link, useParams } from "react-router-dom";
import type { BlogPost } from "../content/blog";
import { getPostBySlug } from "../content/blog";
import { PortableText } from "../components/PortableText";
import { isSanityConfigured, sanityQuery } from "../services/sanity";
import { BLOG_POST_QUERY } from "../services/sanityQueries";
import type { CmsBlogPost } from "../services/sanityTypes";

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  type AnyPost = CmsBlogPost | BlogPost;
  const [post, setPost] = React.useState<AnyPost | null | undefined>(undefined);

  React.useEffect(() => {
    if (!slug) return;

    if (!isSanityConfigured()) {
      setPost(getPostBySlug(slug) ?? null);
      return;
    }

    let cancelled = false;
    sanityQuery<CmsBlogPost | null>(BLOG_POST_QUERY, { slug })
      .then((result) => {
        if (cancelled) return;
        setPost(result ?? null);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error("Sanity BLOG_POST_QUERY failed, falling back to local post.", error);
        if (cancelled) return;
        setPost(getPostBySlug(slug) ?? null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formatDate = (date?: string) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString();
  };

  if (post === undefined) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <main className="w-full max-w-2xl">
          <Link to="/blog" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
            ← Back to Blog
          </Link>
          <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="mt-3 h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <main className="w-full max-w-2xl">
          <Link to="/blog" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
            ← Back to Blog
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-gray-800">Post not found</h1>
          <p className="mt-2 text-gray-600">That link may be old or the post hasn’t been published yet.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-2xl">
        <div className="mb-6">
          <Link to="/blog" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
            ← Blog
          </Link>
        </div>

        <article className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden">
          {post.heroImageUrl ? (
            <img src={post.heroImageUrl} alt={post.title} className="w-full h-56 object-cover" loading="lazy" />
          ) : null}
          <div className="p-6 sm:p-8 animate-fade-in-down">
            <h1 className="text-4xl font-script font-bold text-baker-brown">{post.title}</h1>
            {post.date ? <p className="mt-2 text-sm text-gray-500">{formatDate(post.date)}</p> : null}

            <div className="mt-6 space-y-4 text-gray-800 leading-relaxed">
              {"body" in post
                ? <PortableText value={post.body} />
                : post.content.map((block, index) => {
                    if (block.type === "p") return <p key={index}>{block.text}</p>;
                    return null;
                  })}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
