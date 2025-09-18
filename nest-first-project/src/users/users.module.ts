import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController], // 👈 register controller
  providers: [UsersService], // 👈 register service
})
export class UsersModule {}
