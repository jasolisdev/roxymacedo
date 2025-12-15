import React from "react";
import { Mail, Sparkles } from "lucide-react";

type NewsletterProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
};

export const Newsletter: React.FC<NewsletterProps> = ({
  title = "Join the list 💌",
  description = "Get updates in your inbox.",
  placeholder = "Enter your email address",
  buttonLabel = "Subscribe",
}) => {
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (status === "loading") return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, source: "homepage", company }),
      });

      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Subscribe failed");
      }

      setStatus("success");
      setMessage("You’re on the list!");
      setEmail("");
      setCompany("");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setMessage("Couldn’t subscribe right now. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mt-8 p-6 bg-rose-50 rounded-2xl border border-rose-100 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-rose-200 rounded-full opacity-50 blur-xl"></div>

      <h3 className="font-script text-2xl text-rose-800 mb-2 relative z-10">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 relative z-10">
        {description}
      </p>

      <form className="flex flex-col gap-2 relative z-10" onSubmit={submit}>
        <label className="sr-only" htmlFor="newsletter-email">Email</label>
        <input
          id="newsletter-email"
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white/80 placeholder:text-gray-400 text-sm"
        />
        <label className="sr-only" htmlFor="company">Company</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={[
            "bg-rose-400 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95",
            "disabled:opacity-70 disabled:hover:bg-rose-400 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <Mail size={16} />
          {status === "loading" ? "Subscribing…" : buttonLabel}
        </button>
      </form>

      <div
        role="status"
        aria-live="polite"
        className={[
          "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-4 z-10",
          "transition-all duration-200",
          status === "success" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95",
        ].join(" ")}
      >
        <div className="flex items-center gap-1 rounded-full border border-rose-200 bg-white/95 px-3 py-1 text-xs font-semibold text-rose-600 shadow-md backdrop-blur-sm">
          <Sparkles size={14} className="text-rose-400" />
          {message || "You’re on the list!"}
        </div>
      </div>

      {status === "error" && message ? (
        <p className="text-xs text-rose-600 mt-3">{message}</p>
      ) : (
        <p className="text-[10px] text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
      )}
    </div>
  );
};
