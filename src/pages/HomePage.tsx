import React from "react";
import { ProfileHeader } from "../components/ProfileHeader";
import { LinkButton } from "../components/LinkButton";
import { FeaturedCard } from "../components/FeaturedCard";
import { Newsletter } from "../components/Newsletter";
import { links, profileData } from "../content/profile";
import { blogPosts } from "../content/blog";

export const HomePage: React.FC = () => {
  const featured = blogPosts[0];

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-rose-200">
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-sage to-rose-200 z-50" />

      <main className="w-full max-w-lg flex flex-col items-center gap-6 z-10">
        <ProfileHeader data={profileData} />

        {featured ? (
          <FeaturedCard
            to={`/blog/${featured.slug}`}
            badge="BLOG"
            title={featured.title}
            description={featured.excerpt}
            imageUrl={
              featured.heroImageUrl ??
              "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=1600"
            }
            imageAlt={featured.title}
            cta="Read post"
          />
        ) : null}

        <div className="w-full flex flex-col gap-4 items-center">
          {links.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>

        <Newsletter />

        <footer className="mt-12 text-center">
          <p className="text-gray-400 text-xs font-sans">© {new Date().getFullYear()} {profileData.name}</p>
        </footer>
      </main>
    </div>
  );
};

