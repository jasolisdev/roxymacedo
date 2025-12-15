import React from "react";
import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "../content/blog";

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

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
          <div className="p-6 sm:p-8">
            <h1 className="text-4xl font-script font-bold text-baker-brown">{post.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{post.date}</p>

            <div className="mt-6 space-y-4 text-gray-800 leading-relaxed">
              {post.content.map((block, index) => {
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

