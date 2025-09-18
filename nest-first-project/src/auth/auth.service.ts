import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pool } from '../db.pool'; // ✅ imported pool
import { User } from './user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  // ✅ Signup
  async signup(username: string, password: string): Promise<string> {
    const check = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);

    if (check.rows.length > 0) {
      return 'User already exists';
    }

    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      username,
      password,
    ]);

    return 'User registered successfully';
  }

  // ✅ Login
  async login(username: string, password: string): Promise<string> {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password],
    );

    if (result.rows.length > 0) {
      return `Welcome back, ${username}!`;
    }
    return 'Invalid credentials';
  }

  // ✅ Signout (delete user)
  async signout(username: string): Promise<string> {
    const result = await pool.query(
      'DELETE FROM users WHERE username = $1 RETURNING *',
      [username],
    );

    if (result.rows.length > 0) {
      return `${username} signed out and removed`;
    }
    return 'User not found';
  }

  // ✅ Change Password
  async changepassword(username: string, newPassword: string): Promise<string> {
    if (!newPassword || newPassword.trim().length < 3) {
      return 'New password is invalid (min 3 chars)';
    }

    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING *',
      [newPassword, username],
    );

    if (result.rows.length === 0) {
      return 'User not found';
    }

    return 'Password updated successfully';
  }

  // ✅ Get all users
  async info(): Promise<User[]> {
    const result = await pool.query('SELECT username, password FROM users');
    return result.rows;
  }
}
