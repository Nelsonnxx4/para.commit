"use client";
import { useState } from "react";
import { CommitCategory, CommitMessage } from "@/types";

const CATEGORIES: CommitCategory[] = [
  "feat",
  "fix",
  "refactor",
  "docs",
  "chore",
  "test",
  "perf",
  "style",
];

interface Props {
  onResults: (commits: CommitMessage[]) => void;
}

export default function CommitForm({ onResults }: Props) {
  const [category, setCategory] = useState<CommitCategory>("feat");
  const [topic, setTopic] = useState<string>("");
  const [scope, setScope] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [breaking, setBreaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic, scope, context, breaking }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onResults(data.commits);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category selector */}
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          Commit Type
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all
                ${
                  category === c
                    ? "bg-emerald-400 border-emerald-400 text-black font-semibold"
                    : "border-zinc-800 text-zinc-500 hover:border-emerald-400 hover:text-emerald-400"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Topic + Scope */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
            Topic <span className="text-emerald-400">*</span>
          </label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-emerald-400"
            placeholder="e.g. authentication"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
            Scope (optional)
          </label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-emerald-400"
            placeholder="e.g. api, ui"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          Extra Context (optional)
        </label>
        <textarea
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-emerald-400 resize-none h-20"
          placeholder="What did you do and why?"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      {/* Breaking change */}
      <div className="flex items-center gap-3 p-3 border border-zinc-800 rounded">
        <input
          type="checkbox"
          id="breaking"
          checked={breaking}
          onChange={(e) => setBreaking(e.target.checked)}
          className="accent-emerald-400"
        />
        <label
          htmlFor="breaking"
          className="text-sm text-zinc-400 cursor-pointer"
        >
          Breaking change
        </label>
      </div>

      {error && <p className="text-red-400 text-sm font-mono">✗ {error}</p>}

      <button
        onClick={generate}
        disabled={loading || !topic.trim()}
        className="bg-emerald-400 text-black font-mono font-semibold py-3 px-6 rounded hover:bg-emerald-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "generating..." : "$ generate commits"}
      </button>
    </div>
  );
}
