/**
 * Email classification service
 */
import { routerChain } from '../chains/emailChains';

export type EmailType = 'sales' | 'follow-up';

export const classifyEmail = async (userInput: string): Promise<EmailType> => {
  try {
    const result = await routerChain.invoke({ userInput });
    const classification = result.trim().toLowerCase();
    return classification === 'sales' ? 'sales' : 'follow-up';
  } catch (error) {
    console.error('Router classification failed:', error);
    return 'follow-up';
  }
};
