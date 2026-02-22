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
  category: string;
  topic: string;
  scope?: string;
  context?: string;
  breaking: boolean;
}
