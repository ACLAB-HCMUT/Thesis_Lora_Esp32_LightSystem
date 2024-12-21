import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('SECRET_KEY_JWT'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
