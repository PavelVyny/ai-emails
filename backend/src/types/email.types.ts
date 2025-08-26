export interface Email {
  id: number;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailRequest {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

export interface UpdateEmailRequest {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
}

export interface EmailResponse {
  success: boolean;
  data?: Email;
  error?: string;
}

export interface EmailListResponse {
  success: boolean;
  data?: Email[];
  error?: string;
}
