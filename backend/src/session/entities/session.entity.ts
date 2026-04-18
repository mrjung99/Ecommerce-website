import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'varchar', nullable: false })
  ip!: string;

  @Column({ type: 'varchar', nullable: false })
  device?: string;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'date' })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
