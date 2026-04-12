import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { Comment } from './comments/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: 5432,
        username: config.get('DB_USERNAME') || 'postgres',
        password: '123456',
        database: config.get('DB_NAME') || 'task_manager',
        entities: [User, Task, Comment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}