import { Injectable } from '@nestjs/common';
import { pool } from '../database.provider';

@Injectable()
export class UserService {
  async findAll() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }
}
