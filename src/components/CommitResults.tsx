// src/components/CommitResults.tsx
"use client";
import { useState } from "react";
import { CommitMessage } from "@/types";

export default function CommitResults({
  commits,
}: {
  commits: CommitMessage[];
}) {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (commit: CommitMessage, i: number) => {
    const text = [commit.title, commit.body, commit.footer]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="text-xs text-zinc-500 font-mono">✓ 3 variants generated</p>
      {commits.map((commit, i) => (
        <div
          key={i}
          className="border border-zinc-800 rounded-lg p-5 bg-zinc-950"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
              variant {i + 1}
            </span>
            <button
              onClick={() => copy(commit, i)}
              className="text-xs font-mono border border-zinc-800 px-3 py-1 rounded text-zinc-500 hover:border-emerald-400 hover:text-emerald-400 transition-all"
            >
              {copied === i ? "✓ copied" : "copy"}
            </button>
          </div>
          <p className="font-mono text-emerald-400 text-sm mb-2">
            {commit.title}
          </p>
          {commit.body && (
            <p className="text-zinc-400 text-sm leading-relaxed">
              {commit.body}
            </p>
          )}
          {commit.footer && (
            <p className="font-mono text-xs text-zinc-600 border-t border-zinc-800 pt-3 mt-3">
              {commit.footer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
