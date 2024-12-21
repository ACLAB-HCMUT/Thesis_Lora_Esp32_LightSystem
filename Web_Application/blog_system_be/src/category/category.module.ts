import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
})
export class CategoryModule {}
