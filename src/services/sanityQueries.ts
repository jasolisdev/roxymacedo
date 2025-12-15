export const HOME_PAGE_QUERY = /* groq */ `
(coalesce(
  *[_type == "homePage" && _id == "homePage"][0],
  *[_type == "homePage"][0]
)){
  profileName,
  profileBio,
  "profileAvatarUrl": profileAvatar.asset->url,
  "links": links[]{
    _key,
    title,
    url,
    category,
    icon
  },
  "featured": coalesce(
    featuredPost->{
      title,
      "slug": slug.current,
      excerpt,
      "heroImageUrl": heroImage.asset->url,
      "date": publishedAt
    },
    *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0]{
      title,
      "slug": slug.current,
      excerpt,
      "heroImageUrl": heroImage.asset->url,
      "date": publishedAt
    }
  ),
  newsletterTitle,
  newsletterDescription,
  newsletterPlaceholder,
  newsletterButtonLabel
}
`;

export const BLOG_INDEX_QUERY = /* groq */ `
*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  "heroImageUrl": heroImage.asset->url,
  "date": publishedAt
}
`;

export const BLOG_POST_QUERY = /* groq */ `
*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  excerpt,
  "heroImageUrl": heroImage.asset->url,
  "date": publishedAt,
  "body": body[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  }
}
`;
