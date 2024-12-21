import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UploadModule } from './upload/upload.module';
import { BlogModule } from './blog/blog.module';
import { BlogEntity } from './blog/blog.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CategoryEntity } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { IOTGatewayModule } from './websocket/gateway.module';
import { LightControlModule } from './light_control/light_control.module';
import { DynamoDbModule } from './dynamodb/dynamo.module';
import { DeviceEntity } from './device/device.entity';
import { DeviceModule } from './device/device.module';
@Module({
  imports: [
    DeviceModule,
    DynamoDbModule,
    EventModule,
    IOTGatewayModule,
    LightControlModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    CategoryModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, DeviceEntity],
      synchronize: true,
    }),
    UploadModule,
    BlogModule,
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/src/email/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
