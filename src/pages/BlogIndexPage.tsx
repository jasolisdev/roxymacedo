import React from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../content/blog";

export const BlogIndexPage: React.FC = () => {
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
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-rose-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-rose-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{post.date}</p>
                  <p className="mt-3 text-gray-700 line-clamp-2">{post.excerpt}</p>
                </div>
                <span className="text-rose-400 font-bold">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

