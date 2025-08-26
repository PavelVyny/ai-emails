/**
 * AI Models configuration
 */
import { ChatOpenAI } from '@langchain/openai';

export const MODEL_CONFIGS = {
  router: {
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
  sales: {
    model: 'gpt-4o',
    temperature: 0.7,
  },
  followUp: {
    model: 'gpt-4o-mini',
    temperature: 0.5,
  },
} as const;

export const createRouterModel = () => new ChatOpenAI({
  model: MODEL_CONFIGS.router.model,
  temperature: MODEL_CONFIGS.router.temperature,
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 0,
});

export const createSalesModel = () => new ChatOpenAI({
  model: MODEL_CONFIGS.sales.model,
  temperature: MODEL_CONFIGS.sales.temperature,
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 0,
});

export const createFollowUpModel = () => new ChatOpenAI({
  model: MODEL_CONFIGS.followUp.model,
  temperature: MODEL_CONFIGS.followUp.temperature,
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 0,
});
