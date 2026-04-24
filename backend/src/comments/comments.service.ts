import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findByTask(taskId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { task: { id: taskId } },
      relations: ['author'],
    });
  }

  async create(content: string, taskId: number, authorId: number): Promise<Comment> {
    const comment = this.commentsRepository.create({
      content,
      task: { id: taskId },
      author: { id: authorId },
    });
    return this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}