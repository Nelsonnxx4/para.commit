"use client";
import { useState } from "react";
import CommitForm from "@/components/CommitForm";
import CommitResults from "@/components/CommitResults";
import { CommitMessage } from "@/types";

export default function Home() {
  const [commits, setCommits] = useState<CommitMessage[]>([]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-semibold mb-2">
          para<span className="text-emerald-400">.commit</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-10">
          Generate professional git commit messages instantly
        </p>
        <CommitForm onResults={setCommits} />
        {commits.length > 0 && <CommitResults commits={commits} />}
      </div>
    </main>
  );
}
