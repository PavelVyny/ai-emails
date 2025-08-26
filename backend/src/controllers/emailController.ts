import { FastifyRequest, FastifyReply } from 'fastify';
import DB from '../db/index';
import { CreateEmailRequest, UpdateEmailRequest } from '../types/email.types';
import { EmailParams } from '../types/fastify.types';

export const getAllEmails = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const emails = await DB.getAllEmails();
    return { success: true, data: emails };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.code(500).send({ success: false, error: errorMessage });
  }
};

export const getEmailById = async (
  request: FastifyRequest<{ Params: EmailParams }>, 
  reply: FastifyReply
) => {
  try {
    const email = await DB.getEmailById(parseInt(request.params.id));
    if (!email) {
      reply.code(404).send({ success: false, error: 'Email not found' });
      return;
    }
    return { success: true, data: email };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.code(500).send({ success: false, error: errorMessage });
  }
};

export const createEmail = async (
  request: FastifyRequest<{ Body: CreateEmailRequest }>, 
  reply: FastifyReply
) => {
  try {
    const { to, cc, bcc, subject, body } = request.body;
    const email = await DB.createEmail({
      to: to || '',
      cc: cc || '',
      bcc: bcc || '',
      subject: subject || '',
      body: body || '',
    });
    return { success: true, data: email };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.code(500).send({ success: false, error: errorMessage });
  }
};

export const updateEmail = async (
  request: FastifyRequest<{ Params: EmailParams; Body: UpdateEmailRequest }>, 
  reply: FastifyReply
) => {
  try {
    const { to, cc, bcc, subject, body } = request.body;
    const email = await DB.updateEmail(parseInt(request.params.id), {
      to, cc, bcc, subject, body,
    });
    if (!email) {
      reply.code(404).send({ success: false, error: 'Email not found' });
      return;
    }
    return { success: true, data: email };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.code(500).send({ success: false, error: errorMessage });
  }
};

export const deleteEmail = async (
  request: FastifyRequest<{ Params: EmailParams }>, 
  reply: FastifyReply
) => {
  try {
    const deleted = await DB.deleteEmail(parseInt(request.params.id));
    if (!deleted) {
      reply.code(404).send({ success: false, error: 'Email not found' });
      return;
    }
    return { success: true, message: 'Email deleted' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    reply.code(500).send({ success: false, error: errorMessage });
  }
};
