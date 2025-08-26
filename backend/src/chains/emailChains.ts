/**
 * LangChain email generation chains
 */
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createRouterModel, createSalesModel, createFollowUpModel } from '../config/models';
import { ROUTER_PROMPT, SALES_PROMPT, FOLLOW_UP_PROMPT } from '../config/prompts';

// Create chain instances
export const routerChain = RunnableSequence.from([
  ROUTER_PROMPT,
  createRouterModel(),
  new StringOutputParser(),
]);

export const salesChain = RunnableSequence.from([
  SALES_PROMPT,
  createSalesModel(),
  new StringOutputParser(),
]);

export const followUpChain = RunnableSequence.from([
  FOLLOW_UP_PROMPT,
  createFollowUpModel(),
  new StringOutputParser(),
]);
