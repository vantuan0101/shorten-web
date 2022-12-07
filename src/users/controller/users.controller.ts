import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';
import { AuthenticationUserGuard } from '../../Guards/auth.user.decorator';

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
  @UseGuards(AuthenticationUserGuard)
  @Post('/disable-user')
  disableUser(@Body('id') id: string) {
    return this.usersService.disableUser(id);
  }

  @UseGuards(AuthenticationUserGuard)
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @UseGuards(AuthenticationUserGuard)
  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @UseGuards(AuthenticationUserGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
