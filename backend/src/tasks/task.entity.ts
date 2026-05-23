import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inprogress',
  REVIEW = 'review',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  description: string | null;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ default: false })
  isImportant: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  tag: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deadline: Date | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  assignee: User | null;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}