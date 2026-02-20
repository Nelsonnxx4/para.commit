// src/types/index.ts
export type CommitCategory =
  | "feat"
  | "fix"
  | "refactor"
  | "docs"
  | "chore"
  | "test"
  | "perf"
  | "style";

export interface CommitMessage {
  title: string;
  body: string;
  footer?: string;
}

export interface GeneratePayload {
  category: CommitCategory;
  topic: string;
  scope?: string;
  context?: string;
  breaking: boolean;
}
