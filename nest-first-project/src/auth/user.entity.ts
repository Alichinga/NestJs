// src/auth/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // 👈 table name in database will be "users"
export class User {
  @PrimaryGeneratedColumn()
  id: number; // auto-increment ID

  @Column({ unique: true })
  username: string; // must be unique

  @Column()
  password: string; // plain password for now (later we can hash it)
}
