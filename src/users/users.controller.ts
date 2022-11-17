import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
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
