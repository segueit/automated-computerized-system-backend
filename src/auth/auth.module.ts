import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import AuthService from './auth.service';
import { MailModule } from 'src/services/mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
