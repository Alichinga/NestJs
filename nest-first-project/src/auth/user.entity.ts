// src/auth/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // 👈 table name in database will be "users"
export class User {
  @PrimaryGeneratedColumn()
  id: number; // auto-increment ID

  @Column({ unique: true })
  username: string; // must be unique

  @Column()
  password: string; // plain password for now (later we can hash it)

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column()
  is_verified: boolean; // plain password for now (later we can hash it)

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
