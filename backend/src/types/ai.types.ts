export type EmailType = 'sales' | 'follow-up';

export interface GenerateEmailRequest {
  userInput: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface AIEmailResponse {
  success: boolean;
  data?: GeneratedEmail & { type: EmailType };
  error?: string;
}

export interface StreamChunk {
  chunk: string;
}

export type StreamCallback = (chunk: string) => void;
