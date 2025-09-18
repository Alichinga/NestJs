import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 👉 Signup
  @Post('signup')
  signup(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(username, password);
  }

  // 👉 Login
  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }
  @Put('changepassword/:username')
  passwordchange(
    @Param('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.changepassword(username, password);
  }

  // 👉 Signout (delete user)
  @Delete('signout/:username')
  signout(@Param('username') username: string) {
    return this.authService.signout(username);
  }
  @Get('info')
  info() {
    return this.authService.info();
  }
}
