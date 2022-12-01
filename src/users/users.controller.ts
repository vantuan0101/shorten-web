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
  findAllUser(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findUserById(@Param('id') id: string): Promise<User | string> {
    return this.usersService.findById(id);
  }

  @Post('/disable-user')
  disableUser(@Body() id: string, @UserDecorator() user: User) {
    return this.usersService.disableUser(id, user);
  }

  @Post()
  createUser(@Body() user: CreateUserDto): Promise<User | string> {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User | string> {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<User | string> {
    return this.usersService.deleteUser(id);
  }
}
