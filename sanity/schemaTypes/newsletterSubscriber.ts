import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "createdAt" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleString() : undefined,
    }),
  },
});

