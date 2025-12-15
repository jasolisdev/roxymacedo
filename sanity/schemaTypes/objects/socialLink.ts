import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["social", "shop", "recipe"] },
      initialValue: "social",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: ["tiktok", "instagram", "shop", "email", "link"] },
      initialValue: "link",
      validation: (rule) => rule.required(),
    }),
  ],
});
