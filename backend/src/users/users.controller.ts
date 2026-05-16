import { Controller, Put, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(':id/avatar')
  updateAvatar(@Param('id') id: string, @Body('avatar') avatar: string) {
    return this.usersService.updateAvatar(+id, avatar);
  }
}