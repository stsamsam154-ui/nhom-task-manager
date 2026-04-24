import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(+taskId);
  }

  @Post()
  create(@Body() body: any) {
    return this.commentsService.create(
      body.content,
      body.taskId,
      body.authorId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}