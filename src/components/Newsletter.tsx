import React from "react";
import { Mail } from "lucide-react";

export const Newsletter: React.FC = () => {
  return (
    <div className="w-full max-w-md mt-8 p-6 bg-rose-50 rounded-2xl border border-rose-100 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-rose-200 rounded-full opacity-50 blur-xl"></div>

      <h3 className="font-script text-2xl text-rose-800 mb-2 relative z-10">
        Join the list 💌
      </h3>
      <p className="text-gray-600 text-sm mb-4 relative z-10">
        Get updates in your inbox.
      </p>

      <form className="flex flex-col gap-2 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email address"
          className="px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white/80 placeholder:text-gray-400 text-sm"
        />
        <button className="bg-rose-400 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95">
          <Mail size={16} />
          Subscribe
        </button>
      </form>

      <p className="text-[10px] text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
};

