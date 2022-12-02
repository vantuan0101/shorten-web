import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UserDecorator } from 'src/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entites/user.entites';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAllUser() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Only admin can disable user
  @Post('/disable-user')
  disableUser(@Body('id') id: string, @UserDecorator() user: User) {
    return this.usersService.disableUser(id, user);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
