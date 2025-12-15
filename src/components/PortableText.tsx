import React from "react";
import type {
  PortableTextBlock,
  PortableTextImage,
  PortableTextMarkDef,
  PortableTextSpan,
} from "../services/sanityTypes";

type PortableTextProps = {
  value: Array<PortableTextBlock | Record<string, unknown>>;
};

function renderSpan(
  span: PortableTextSpan,
  markDefsByKey: Record<string, PortableTextMarkDef>,
  key: React.Key,
) {
  const marks = span.marks ?? [];

  const content = marks.reduce<React.ReactNode>((node, mark) => {
    if (mark === "strong") return <strong key={`${key}-strong`}>{node}</strong>;
    if (mark === "em") return <em key={`${key}-em`}>{node}</em>;

    const def = markDefsByKey[mark];
    if (def?._type === "link" && typeof def.href === "string") {
      const href = def.href;
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          key={`${key}-link`}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-rose-600 hover:text-rose-700 underline underline-offset-2"
        >
          {node}
        </a>
      );
    }

    return node;
  }, span.text);

  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function blockToPlainText(block: PortableTextBlock) {
  return (block.children ?? []).map((c) => c.text).join("");
}

export const PortableText: React.FC<PortableTextProps> = ({ value }) => {
  const rendered: React.ReactNode[] = [];
  let activeList: { type: "bullet" | "number"; items: PortableTextBlock[] } | null = null;

  const flushList = () => {
    if (!activeList) return;
    const ListTag = activeList.type === "number" ? "ol" : "ul";
    rendered.push(
      <ListTag
        key={`list-${rendered.length}`}
        className={activeList.type === "number" ? "list-decimal pl-6 space-y-2" : "list-disc pl-6 space-y-2"}
      >
        {activeList.items.map((item, index) => {
          const markDefsByKey = Object.fromEntries(
            (item.markDefs ?? []).map((def) => [def._key, def]),
          );
          return (
            <li key={item._key ?? index} className="text-gray-800 leading-relaxed">
              {item.children.map((span, spanIndex) =>
                renderSpan(span, markDefsByKey, `${item._key ?? index}-${spanIndex}`),
              )}
            </li>
          );
        })}
      </ListTag>,
    );
    activeList = null;
  };

  for (const node of value) {
    if ((node as PortableTextImage)._type === "image") {
      flushList();
      const image = node as PortableTextImage;
      if (!image.url) continue;
      rendered.push(
        <img
          key={image._key ?? `img-${rendered.length}`}
          src={image.url}
          alt={image.alt ?? ""}
          loading="lazy"
          className="w-full rounded-xl border border-rose-100 bg-white shadow-sm"
        />,
      );
      continue;
    }

    if ((node as PortableTextBlock)._type !== "block") continue;
    const block = node as PortableTextBlock;

    if (block.listItem) {
      const listType = block.listItem;
      if (!activeList || activeList.type !== listType) {
        flushList();
        activeList = { type: listType, items: [] };
      }
      activeList.items.push(block);
      continue;
    }

    flushList();

    const markDefsByKey = Object.fromEntries((block.markDefs ?? []).map((def) => [def._key, def]));
    const key = block._key ?? rendered.length;

    const children = block.children.map((span, index) =>
      renderSpan(span, markDefsByKey, `${key}-${index}`),
    );

    const style = block.style ?? "normal";
    if (style === "h1") {
      rendered.push(
        <h1 key={key} className="text-3xl font-semibold text-gray-900">
          {children}
        </h1>,
      );
    } else if (style === "h2") {
      rendered.push(
        <h2 key={key} className="text-2xl font-semibold text-gray-900">
          {children}
        </h2>,
      );
    } else if (style === "h3") {
      rendered.push(
        <h3 key={key} className="text-xl font-semibold text-gray-900">
          {children}
        </h3>,
      );
    } else if (style === "blockquote") {
      rendered.push(
        <blockquote key={key} className="border-l-4 border-rose-200 pl-4 italic text-gray-700">
          {children}
        </blockquote>,
      );
    } else {
      const text = blockToPlainText(block);
      if (!text.trim()) continue;
      rendered.push(
        <p key={key} className="text-gray-800 leading-relaxed">
          {children}
        </p>,
      );
    }
  }

  flushList();

  return <div className="space-y-4">{rendered}</div>;
};
