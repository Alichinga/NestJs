import { Controller, Get, Post, Body } from '@nestjs/common';
import { pool } from '../database.provider';

@Controller('user')
export class UserController {
  // ✅ Get all users
  @Get()
  async getUsers() {
    const result: any = await pool.query('SELECT * FROM users');
    return result.rows;
  }

  // ✅ Insert new user
  @Post()
  async addUser(@Body() body: { name: string; email: string }) {
    const { name, email } = body;

    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email],
    );

    return {
      message: 'User added successfully',
      user: result.rows[0],
    };
  }
}
