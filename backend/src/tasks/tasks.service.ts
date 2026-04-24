import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['assignee', 'comments'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignee', 'comments'],
    });
    if (!task) throw new NotFoundException('Task không tồn tại!');
    return task;
  }

  async create(title: string, description: string, deadline: Date, assigneeId: number): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      deadline,
      assignee: { id: assigneeId },
    });
    return this.tasksRepository.save(task);
  }

  async updateStatus(id: number, status: string): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }

  async update(id: number, title: string, description: string, deadline: Date): Promise<Task> {
    const task = await this.findOne(id);
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.deadline = deadline ?? task.deadline;
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}