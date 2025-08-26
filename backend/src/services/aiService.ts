import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { classifyEmail } from './emailClassifier';
import { createSalesModel, createFollowUpModel } from '../config/models';
import { SALES_PROMPT, FOLLOW_UP_PROMPT } from '../config/prompts';

export interface StreamingChunk {
  type: 'routing' | 'subject' | 'body' | 'error';
  content: string;
}

/**
 * Generate email with streaming using LangChain streamEvents + JsonOutputParser
 * 
 * Uses langchain built-in incremental JSON parsing for real-time UI updates.
 */
export const streamEmailGeneration = async function* (userInput: string): AsyncGenerator<StreamingChunk> {
  try {
    // Step 1: Classify email type
    const emailType = await classifyEmail(userInput);
    yield { type: 'routing', content: emailType };
    
    // Step 2: Create streaming chain with JsonOutputParser for incremental JSON parsing
    const baseModel = emailType === 'sales' ? createSalesModel() : createFollowUpModel();
    const streamingModel = new ChatOpenAI({
      model: baseModel.model,
      temperature: baseModel.temperature,
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
      streaming: true,
    });
    
    const chain = RunnableSequence.from([
      emailType === 'sales' ? SALES_PROMPT : FOLLOW_UP_PROMPT,
      streamingModel,
      new JsonOutputParser(),
    ]);
    
    // Step 3: Use streamEvents for granular streaming events
    let lastSubject = '';
    let lastBody = '';
    
    const eventStream = chain.streamEvents({ userInput }, { version: 'v2' });
    
    for await (const event of eventStream) {
      // Process parser events that contain partial JSON
      if (event.event === 'on_parser_stream' && event.name === 'JsonOutputParser') {
        const partialData = event.data?.chunk;
        
        if (partialData && typeof partialData === 'object') {
          // Stream subject updates
          if (partialData.subject && partialData.subject !== lastSubject) {
            lastSubject = partialData.subject;
            yield { type: 'subject', content: lastSubject };
          }
          
          // Stream body updates
          if (partialData.body && partialData.body !== lastBody) {
            lastBody = partialData.body;
            yield { type: 'body', content: lastBody };
          }
        }
      }
    }
    
  } catch (error) {
    yield { type: 'error', content: error instanceof Error ? error.message : 'Unknown error' };
  }
};
