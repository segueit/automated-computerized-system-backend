import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import AuthService from './auth.service';
import { CreateColdStorageDto } from 'src/dto/create-cold-storage.dto';
import { LoginColdStorageDto } from 'src/dto/login-cold-storage.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerColdStorage(
    @Body() createColdStorageDto: CreateColdStorageDto,
  ) {
    return this.authService.registerColdStorage(createColdStorageDto);
  }

  @Post('login')
  async loginColdStorage(@Body() loginColdStorageDto: LoginColdStorageDto) {
    return this.authService.loginColdStorage(loginColdStorageDto);
  }
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request,
  ) {
    return this.authService.changePassword(
      request.storageId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  async resetToken(@Body() resetPassowrdDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPassowrdDto);
  }
}
