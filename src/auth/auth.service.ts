import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateColdStorageDto } from 'src/dto/create-cold-storage.dto';
import * as bcrypt from 'bcrypt';
import { LoginColdStorageDto } from 'src/dto/login-cold-storage.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Fn❗ Upserting refresh token in database
  async upsertRefreshToken(refreshToken: string, storageId: string) {
    await this.databaseService.refreshToken.upsert({
      where: {
        storageId,
      },
      update: {
        token: refreshToken,
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      create: {
        token: refreshToken,
        storageId,
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
  }

  // ----------------------------------------------------------------------------- //

  // ✅ POST - Register Cold Storage
  async registerColdStorage(createColdStorageDto: CreateColdStorageDto) {
    const { name, codes, email, password } = createColdStorageDto;

    // Finding if cold storage is already registered
    const storageExists = await this.databaseService.coldStorage.findUnique({
      where: {
        email,
      },
    });
    if (storageExists) {
      throw new BadRequestException('Email already in use!');
    }
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating cold storage
    const coldStorage = await this.databaseService.coldStorage.create({
      data: {
        name,
        codes,
        email,
        password: hashedPassword,
      },
    });
    return {
      Message: 'Cold Storage added successfully!',
      ColdStorage: coldStorage,
    };
  }

  // ✅ Login - Login Cold Storage
  async loginColdStorage(loginColdStorageDto: LoginColdStorageDto) {
    const { email, password } = loginColdStorageDto;
    // Finding if cold storage exists
    const coldStorageExists = await this.databaseService.coldStorage.findUnique(
      {
        where: {
          email,
        },
      },
    );
    if (!coldStorageExists) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // Verify password
    const verifyPassword = await bcrypt.compare(
      password,
      coldStorageExists.password,
    );
    if (!verifyPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // Creating JWT Access token
    const accessToken = this.jwtService.sign({
      storageId: coldStorageExists.id,
    });
    // Creating and Saving Refresh Token in Database
    const refreshToken = uuid();
    await this.upsertRefreshToken(refreshToken, coldStorageExists.id);

    return {
      Message: 'User logged in successfully!',
      accessToken,
      refreshToken,
    };
  }

  // ✅ POST - Refresh RefreshToken
  async refreshToken(token: string) {
    const tokenExists = await this.databaseService.refreshToken.findFirst({
      where: {
        token: { equals: token },
        expiryDate: {
          gte: new Date(),
        },
      },
    });
    if (!tokenExists) {
      throw new UnauthorizedException('Invalid token!');
    }

    const accessToken = this.jwtService.sign({
      storageId: tokenExists?.storageId,
    });
    // Creating and Saving new Refresh token
    const refreshToken = uuid();
    await this.upsertRefreshToken(refreshToken, tokenExists?.storageId);
    return {
      Message: 'Token refreshed successfully',
      accessToken,
      refreshToken,
    };
  }

  // ✅ PUT - Change Password
  async changePassword(storageId, oldPassword: string, newPassword: string) {
    console.log('storageId', storageId);
    // Finding storage
    const storageExists = await this.databaseService.coldStorage.findUnique({
      where: {
        id: storageId,
      },
    });
    // If it doesn't exists
    if (!storageExists) {
      throw new BadRequestException("Storage doesn't exists!");
    }

    // Varifying Passwords
    const varifyPassword = await bcrypt.compare(
      oldPassword,
      storageExists.password,
    );
    if (!varifyPassword) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.databaseService.coldStorage.update({
      where: {
        id: storageId,
      },
      data: {
        password: hashedNewPassword,
      },
    });
    return { Message: 'Password changed successfully!' };
  }

  // ✅ POST - Forgot Password
  async forgotPassword(email: string) {
    // Find storage
    const storageExists = await this.databaseService.coldStorage.findUnique({
      where: {
        email,
      },
    });
    if (storageExists) {
      const resetToken = nanoid(64);
      await this.databaseService.resetToken.upsert({
        where: {
          storageId: storageExists.id,
        },
        update: {
          token: resetToken,
        },
        create: {
          token: resetToken,
          storageId: storageExists.id,
        },
      });
      try {
        await this.mailService.sendPasswordResetEmail(email, resetToken);
      } catch (error) {
        console.error('Error sending email', error);
      }
    }
    return { Message: 'Email sent!' };
  }

  // ✅ PUT - Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;

    // Finding if token exists
    const resetTokenExists = await this.databaseService.resetToken.findUnique({
      where: {
        token: resetToken,
      },
    });

    if (!resetTokenExists) {
      throw new UnauthorizedException('Invalid token!');
    }

    // Reseting the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Updating the password
    await this.databaseService.coldStorage.update({
      where: {
        id: resetTokenExists.storageId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    // Deleting the reset token
    await this.databaseService.resetToken.delete({
      where: {
        storageId: resetTokenExists.storageId,
      },
    });

    return {
      Message: 'Password reset successfully',
    };
  }
}
