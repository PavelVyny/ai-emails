import { useState, useEffect, useCallback } from 'react';
import { Email, CreateEmailData } from '../types/email.types';
import { ApiResponse } from '../types/api.types';

const API_BASE = 'http://localhost:3001';

interface UseEmailsReturn {
  emails: Email[];
  loading: boolean;
  error: string | null;
  fetchEmails: () => Promise<void>;
  createEmail: (emailData: CreateEmailData) => Promise<Email>;
}

export default function useEmails(): UseEmailsReturn {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/emails`);
      const data: ApiResponse<Email[]> = await response.json();
      
      if (data.success && data.data) {
        setEmails(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch emails');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmail = async (emailData: CreateEmailData): Promise<Email> => {
    try {
      const response = await fetch(`${API_BASE}/api/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      const data: ApiResponse<Email> = await response.json();
      
      if (data.success && data.data) {
        await fetchEmails();
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to create email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return {
    emails,
    loading,
    error,
    fetchEmails,
    createEmail,
  };
}
