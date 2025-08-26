/**
 * AI Prompts templates
 */
import { PromptTemplate } from '@langchain/core/prompts';

export const ROUTER_PROMPT = PromptTemplate.fromTemplate(`
Analyze this request and classify it as either "sales" or "follow-up":

Request: "{userInput}"

Classification rules:
- Sales: New product pitches, promotional content, lead generation
- Follow-up: Status updates, meeting requests, project updates

Respond with only one word: "sales" or "follow-up"
`);

export const SALES_PROMPT = PromptTemplate.fromTemplate(`
Generate a sales email based on: {userInput}

Requirements:
- Maximum 40 words total
- Professional and engaging tone
- Include clear call to action

Return ONLY valid JSON: {{"subject": "Your Subject", "body": "Your email body"}}
`);

export const FOLLOW_UP_PROMPT = PromptTemplate.fromTemplate(`
Generate a follow-up email based on: {userInput}

Requirements:
- Professional and courteous tone
- Brief and respectful
- Clear purpose

Return ONLY valid JSON: {{"subject": "Your Subject", "body": "Your email body"}}
`);
