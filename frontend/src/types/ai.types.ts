export type EmailType = 'sales' | 'follow-up';

export interface GenerateEmailRequest {
  userInput: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  type: EmailType;
}

export interface AIResponse {
  success: boolean;
  data?: GeneratedEmail;
  error?: string;
}
