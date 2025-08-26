import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateEmailRequest, UpdateEmailRequest } from './email.types';
import { GenerateEmailRequest } from './ai.types';

export interface EmailParams {
  id: string;
}

export type CreateEmailHandler = (
  request: FastifyRequest<{ Body: CreateEmailRequest }>,
  reply: FastifyReply
) => Promise<void>;

export type UpdateEmailHandler = (
  request: FastifyRequest<{ Params: EmailParams; Body: UpdateEmailRequest }>,
  reply: FastifyReply
) => Promise<void>;

export type GetEmailHandler = (
  request: FastifyRequest<{ Params: EmailParams }>,
  reply: FastifyReply
) => Promise<void>;

export type DeleteEmailHandler = (
  request: FastifyRequest<{ Params: EmailParams }>,
  reply: FastifyReply
) => Promise<void>;

export type GenerateEmailHandler = (
  request: FastifyRequest<{ Body: GenerateEmailRequest }>,
  reply: FastifyReply
) => Promise<void>;
