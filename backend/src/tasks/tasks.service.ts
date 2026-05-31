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
    if (!task) throw new NotFoundException('Task không tồn tại!');
    return task;
  }

  async create(
    title: string,
    description: string,
    deadline: Date | null,
    assigneeId: number,
    status?: string,
    tag?: string,
  ): Promise<Task> {
    if (status && !this.isValidStatus(status)) {
      throw new BadRequestException('Trạng thái task không hợp lệ!');
    }

    const taskStatus = status ? (status as TaskStatus) : TaskStatus.TODO;
    const task = this.tasksRepository.create({
      title,
      description,
      deadline,
      status: taskStatus,
      tag: tag || null,
      assignee: assigneeId ? { id: assigneeId } : null,
    });
    return this.tasksRepository.save(task);
  }

  async updateStatus(id: number, status: string): Promise<Task> {
    if (!this.isValidStatus(status)) {
      throw new BadRequestException('Trạng thái task không hợp lệ!');
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
    tag?: string,
  ): Promise<Task> {
    const task = await this.findOne(id);
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.deadline = deadline ?? task.deadline;
    task.tag = tag ?? task.tag;
    return this.tasksRepository.save(task);
  }

  async toggleImportant(id: number): Promise<Task> {
    const task = await this.findOne(id);
    task.isImportant = !task.isImportant;
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Task không tồn tại!');
  }

  private isValidStatus(status: string): status is TaskStatus {
    return Object.values(TaskStatus).includes(status as TaskStatus);
  }
}
