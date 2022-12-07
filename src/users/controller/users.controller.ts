import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PageOptionsDto } from '../../shorten-link/dto/PageOptionsDto';
import { AuthenticationUserGuard } from '../../Guards/auth.user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/populate')
  getAllLinkOfUsers(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.getAllLinkOfUsers(pageOptionsDto);
  }

  @Get('/populate/:id')
  getAllLinkOfUserById(@Param('id') id: string) {
    return this.usersService.getAllLinkOfUserById(id);
  }

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
