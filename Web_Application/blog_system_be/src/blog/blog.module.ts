import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
  imports: [TypeOrmModule.forFeature([BlogEntity])],
})
export class BlogModule {}
