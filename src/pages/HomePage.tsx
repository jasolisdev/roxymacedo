import React from "react";
import { ProfileHeader } from "../components/ProfileHeader";
import { LinkButton } from "../components/LinkButton";
import { FeaturedCard } from "../components/FeaturedCard";
import { Newsletter } from "../components/Newsletter";
import { links, profileData } from "../content/profile";
import { blogPosts } from "../content/blog";
import { getSocialIcon } from "../components/icons/getSocialIcon";
import { isSanityConfigured, sanityQuery } from "../services/sanity";
import { HOME_PAGE_QUERY } from "../services/sanityQueries";
import type { CmsHomePage } from "../services/sanityTypes";
import { BookOpen } from "lucide-react";

export const HomePage: React.FC = () => {
  const [home, setHome] = React.useState<CmsHomePage | null>(null);

  React.useEffect(() => {
    if (!isSanityConfigured()) return;

    let cancelled = false;
    sanityQuery<CmsHomePage>(HOME_PAGE_QUERY)
      .then((result) => {
        if (cancelled) return;
        setHome(result ?? null);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error("Sanity HOME_PAGE_QUERY failed, falling back to local content.", error);
        if (cancelled) return;
        setHome(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = home?.featured ?? blogPosts[0];
  const profile = home
    ? { name: home.profileName, bio: home.profileBio, avatarUrl: home.profileAvatarUrl ?? "" }
    : profileData;

  const linkItems = home
    ? home.links.map((l) => ({
        id: l._key,
        title: l.title,
        url: l.url,
        category: l.category,
        icon: getSocialIcon(l.icon, 20),
      }))
    : links;

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-rose-200">
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-sage to-rose-200 z-50" />

      <main className="w-full max-w-lg flex flex-col items-center gap-6 z-10">
        <ProfileHeader data={profile} />

        {featured ? (
          <>
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
            <LinkButton
              link={{
                id: "all-posts",
                title: "View all blog posts",
                url: "/blog",
                category: "social",
                icon: <BookOpen size={20} />,
              }}
            />
          </>
        ) : null}

        <div className="w-full flex flex-col gap-4 items-center">
          {linkItems.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>

        <Newsletter
          title={home?.newsletterTitle}
          description={home?.newsletterDescription}
          placeholder={home?.newsletterPlaceholder}
          buttonLabel={home?.newsletterButtonLabel}
        />

        <footer className="mt-12 text-center">
          <p className="text-gray-400 text-xs font-sans">© {new Date().getFullYear()} {profile.name}</p>
        </footer>
      </main>
    </div>
  );
};
