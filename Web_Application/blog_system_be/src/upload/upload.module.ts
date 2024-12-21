import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UploadModule {}
