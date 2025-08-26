/**
 * Email generation service using LangChain
 */
import { salesChain, followUpChain } from '../chains/emailChains';
import { EmailType } from './emailClassifier';

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export const generateSalesEmail = async (userInput: string): Promise<GeneratedEmail> => {
  try {
    const result = await salesChain.invoke({ userInput });
    return JSON.parse(result.trim());
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Sales generation failed');
  }
};

export const generateFollowUpEmail = async (userInput: string): Promise<GeneratedEmail> => {
  try {
    const result = await followUpChain.invoke({ userInput });
    return JSON.parse(result.trim());
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Follow-up generation failed');
  }
};

export const generateEmailByType = async (
  userInput: string, 
  emailType: EmailType
): Promise<GeneratedEmail> => {
  return emailType === 'sales' 
    ? generateSalesEmail(userInput)
    : generateFollowUpEmail(userInput);
};
