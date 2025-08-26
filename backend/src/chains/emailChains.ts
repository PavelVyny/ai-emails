/**
 * LangChain router chain for email classification
 */
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createRouterModel } from '../config/models';
import { ROUTER_PROMPT } from '../config/prompts';

// Router chain for email type classification
export const routerChain = RunnableSequence.from([
  ROUTER_PROMPT,
  createRouterModel(),
  new StringOutputParser(),
]);
