import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "profileName",
      title: "Profile Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileBio",
      title: "Profile Bio",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileAvatar",
      title: "Profile Avatar",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "socialLink" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featuredPost",
      title: "Featured Blog Post",
      type: "reference",
      to: [{ type: "blogPost" }],
    }),
    defineField({
      name: "newsletterTitle",
      title: "Newsletter Title",
      type: "string",
    }),
    defineField({
      name: "newsletterDescription",
      title: "Newsletter Description",
      type: "string",
    }),
    defineField({
      name: "newsletterPlaceholder",
      title: "Newsletter Placeholder",
      type: "string",
    }),
    defineField({
      name: "newsletterButtonLabel",
      title: "Newsletter Button Label",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
