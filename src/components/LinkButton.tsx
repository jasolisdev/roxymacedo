import React from "react";
import type { SocialLink } from "../types";
import { ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
  link: SocialLink;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ link }) => {
  const isMailtoLink = link.url.toLowerCase().startsWith("mailto:");
  const isInternalLink = link.url.startsWith("/");
  const isExternalHttpLink = /^https?:\/\//i.test(link.url);
  const [isCopied, setIsCopied] = React.useState(false);
  const hideCopiedTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (hideCopiedTimeoutRef.current) window.clearTimeout(hideCopiedTimeoutRef.current);
    };
  }, []);

  const copyTextToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fall through to legacy copy
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const getEmailFromMailto = (url: string) => url.replace(/^mailto:/i, "").split("?")[0] ?? "";

  const handleEmailClick = async () => {
    const email = getEmailFromMailto(link.url);
    if (!email) return;

    const didCopy = await copyTextToClipboard(email);
    if (!didCopy) return;

    setIsCopied(true);
    if (hideCopiedTimeoutRef.current) window.clearTimeout(hideCopiedTimeoutRef.current);
    hideCopiedTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 1600);
  };

  const content = (
    <>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-100 to-sage opacity-50 group-hover:opacity-100 rounded-xl blur transition duration-200" />
      <div className="relative flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-rose-50 hover:border-rose-200 transition-colors">
        <div className="flex items-center gap-3">
          {link.icon ? (
            <span className="text-rose-400 group-hover:text-rose-500 transition-colors">
              {link.icon}
            </span>
          ) : null}
          <span className="font-sans font-semibold text-gray-700 group-hover:text-rose-600 transition-colors">
            {link.title}
          </span>
        </div>
        {isMailtoLink ? (
          <span className="text-gray-300 group-hover:text-rose-400 transition-colors text-xs font-semibold">
            Copy
          </span>
        ) : (
          <ExternalLink size={16} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        className={[
          "pointer-events-none absolute -top-3 right-3 z-10",
          "transition-all duration-200",
          isCopied ? "opacity-100 -translate-y-1 scale-100" : "opacity-0 translate-y-1 scale-95",
        ].join(" ")}
      >
        <div className="flex items-center gap-1 rounded-full border border-rose-200 bg-white/95 px-3 py-1 text-xs font-semibold text-rose-600 shadow-md backdrop-blur-sm">
          <Sparkles size={14} className="text-rose-400" />
          Copied!
        </div>
      </div>
    </>
  );

  if (isMailtoLink) {
    return (
      <button
        type="button"
        onClick={handleEmailClick}
        className="group relative w-full max-w-md transform transition-all hover:-translate-y-1 text-left"
      >
        {content}
      </button>
    );
  }

  if (isInternalLink) {
    return (
      <Link
        to={link.url}
        className="group relative w-full max-w-md transform transition-all hover:-translate-y-1"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.url}
      target={isExternalHttpLink ? "_blank" : undefined}
      rel={isExternalHttpLink ? "noopener noreferrer" : undefined}
      className="group relative w-full max-w-md transform transition-all hover:-translate-y-1"
    >
      {content}
    </a>
  );
};
