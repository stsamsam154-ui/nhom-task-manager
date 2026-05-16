import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';

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
    if (!task) throw new NotFoundException('Task khong ton tai!');
    return task;
  }

  async create(
    title: string,
    description: string,
    deadline: Date | null,
    assigneeId: number,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      deadline,
      assignee: assigneeId ? { id: assigneeId } : null,
    });
    return this.tasksRepository.save(task);
  }

  async updateStatus(id: number, status: string): Promise<Task> {
    if (!this.isValidStatus(status)) {
      throw new BadRequestException('Trang thai task khong hop le!');
    }

    const task = await this.findOne(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }

  async update(
    id: number,
    title: string,
    description: string,
    deadline: Date | null,
  ): Promise<Task> {
    const task = await this.findOne(id);
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.deadline = deadline ?? task.deadline;
    return this.tasksRepository.save(task);
  }

  async toggleImportant(id: number): Promise<Task> {
    const task = await this.findOne(id);
    task.isImportant = !task.isImportant;
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Task khong ton tai!');
  }

  private isValidStatus(status: string): status is TaskStatus {
    return Object.values(TaskStatus).includes(status as TaskStatus);
  }
}
