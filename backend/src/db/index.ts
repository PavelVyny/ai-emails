import knex, { Knex } from 'knex';
import { Email, CreateEmailRequest, UpdateEmailRequest } from '../types/email.types';

const db: Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
});

export class DB {
  static async getAllEmails(): Promise<Email[]> {
    return db('emails').select('*').orderBy('created_at', 'desc');
  }

  static async getEmailById(id: number): Promise<Email | undefined> {
    return db('emails').where('id', id).first();
  }

  static async createEmail(data: CreateEmailRequest): Promise<Email> {
    const [id] = await db('emails').insert(data);
    const email = await this.getEmailById(id);
    if (!email) {
      throw new Error('Failed to create email');
    }
    return email;
  }

  static async updateEmail(id: number, data: UpdateEmailRequest): Promise<Email | undefined> {
    await db('emails').where('id', id).update(data);
    return this.getEmailById(id);
  }

  static async deleteEmail(id: number): Promise<number> {
    return db('emails').where('id', id).del();
  }
}

export default DB;
