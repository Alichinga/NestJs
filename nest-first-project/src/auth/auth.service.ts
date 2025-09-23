import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { pool } from '../db.pool';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter;
  private readonly rounds = 10;

  constructor(
     private readonly configService: ConfigService,
     private readonly jwtService: JwtService, 
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // ✅ Reusable mail sender
  private async sendMail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_USER'),
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('❌ Mail error:', error);
    }
  }

  async generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  // ✅ Signup with OTP
  async signup(username: string, password: string): Promise<string> {
    const check = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (check.rows.length > 0) {
      return 'User already exists';
    }

    const hashpass = await bcrypt.hash(password, this.rounds);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    await pool.query(
      'INSERT INTO users (username, password, otp, is_verified) VALUES ($1, $2, $3, false)',
      [username, hashpass, otp],
    );

    await this.sendMail(username, 'Your OTP Code', `Your OTP is: ${otp}`);
    return 'User registered. Please verify OTP sent to your email.';
  }

  // ✅ Verify OTP
  async verifyOtp(username: string, otp: string): Promise<string> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);

    if (result.rows.length === 0) return 'User not found';

    const user = result.rows[0];
    if (user.otp == otp) {
      console.log("jkkkkkkkkkkkkkkkkkkkkkkkkkk....................................")
      await pool.query(
        'UPDATE users SET is_verified = true, otp = $2, updated_at = CURRENT_TIMESTAMP WHERE username = $1',
        [username,null],
      );

      return '✅ OTP verified successfully!';
    }
    return '❌ Invalid OTP';
  }

  // ✅ Login (with JWT token)
  async login(username: string, password: string): Promise<any> {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );

    if (result.rows.length === 0) return { message: 'Invalid credentials' };
    const user = result.rows[0];

    if (!user.is_verified) {
      return { message: 'Please verify your email with OTP before logging in' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = { username: user.username, sub: user.id };
      const token = this.jwtService.sign(payload);

      await this.sendMail(
        username,
        'Login Alert',
        `You logged in at ${new Date().toLocaleString()}`,
      );

      return {
        message: `Welcome back, ${username}!`,
        access_token: token,
      };
    }
    return { message: 'Invalid credentials' };
  }

   // ✅ Protected route example
   async profile(username: string) {
    const result = await pool.query(
      'SELECT id, username, is_verified, created_at FROM users WHERE username = $1',
      [username],
    );
    return result.rows[0];
  }

  // ✅ Change Password
  async changepassword(username: string, newPassword: string): Promise<string> {
    if (!newPassword || newPassword.trim().length < 3) {
      return 'New password is invalid (min 3 chars)';
    }

    const newHash = await bcrypt.hash(newPassword, this.rounds);
    const result = await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING *',
      [newHash, username],
    );

    if (result.rows.length === 0) return 'User not found';

    await this.sendMail(
      username,
      'Password Changed',
      'Your password has been updated successfully.',
    );

    return 'Password updated successfully';
  }

  // ✅ Signout (delete account)
  async signout(username: string): Promise<string> {
    const result = await pool.query(
      'DELETE FROM users WHERE username = $1 RETURNING *',
      [username],
    );

    if (result.rows.length > 0) {
      await this.sendMail(
        username,
        'Account Removed',
        `Your account (${username}) has been deleted.`,
      );
      return `${username} signed out and removed`;
    }
    return 'User not found';
  }

  // ✅ Logout (does not delete account)
  async logout(username: string): Promise<string> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (result.rows.length === 0) return 'User not found';

    await this.sendMail(
      username,
      'Logout Alert',
      `You logged out at ${new Date().toLocaleString()}`,
    );
    return `${username} logged out successfully`;
  }

  // ✅ Get all users (hide passwords)
  async info(): Promise<User[]> {
    const result = await pool.query(
      'SELECT id, username, is_verified, created_at, updated_at FROM users',
    );
    return result.rows;
  }
}
