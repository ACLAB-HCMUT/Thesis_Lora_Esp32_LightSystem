import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<CategoryEntity>);
}
