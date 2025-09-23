import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 👉 Signup (sends OTP)
  @Post('signup')
  signup(@Body('username') username: string, @Body('password') password: string) {
    return this.authService.signup(username, password);
  }

  // 👉 Verify OTP
  @Post('verify-otp')
  verifyOtp(@Body('username') username: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(username, otp);
  }

  // 👉 Login
  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.authService.login(username, password);
  }

  // 👉 Protected Profile Route
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.profile(req.user.username);
  }

  // 👉 Change Password
  @Put('changepassword/:username')
  passwordchange(
    @Param('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.changepassword(username, password);
  }

  // 👉 Signout (delete account)
  @Delete('signout/:username')
  signout(@Param('username') username: string) {
    return this.authService.signout(username);
  }

  // 👉 Logout (just a message, does not delete account)
  @Post('logout/:username')
  logout(@Param('username') username: string) {
    return this.authService.logout(username);
  }

  // 👉 Get all users
  @Get('info')
  info() {
    return this.authService.info();
  }
}
