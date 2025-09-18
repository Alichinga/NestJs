import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // 👇 Inject UsersService into the controller
  constructor(private readonly usersService: UsersService) {}

  // Get user data
  @Get('info')
  userInfo() {
    return this.usersService.getAllUsers();
  }
  // Get user by id
  @Get(':id')
  userName(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }
  // Add User name
  @Post()
  addUser(@Body('name') name: string) {
    return this.usersService.addUser(name);
  }
  // Update User By id
  @Put(':id')
  updateuser(@Param('id') id: string, @Body('name') name: string) {
    console.log('id', id);
    return this.usersService.updateuser(Number(id), name);
  }
  // Delete Use by id
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteuser(Number(id));
  }
}
