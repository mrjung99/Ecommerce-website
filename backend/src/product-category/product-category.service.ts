import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { IsNull, Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepo: Repository<ProductCategory>,
  ) {}

  //* -----------------ADD CATEGORY ------------------
  async addCategory(dto: CreateProductCategoryDto) {
    const category = this.productCategoryRepo.create({
      name: dto.name,
      slug: dto.slug,
    });

    if (dto.parentId) {
      const parent: ProductCategory | null =
        await this.productCategoryRepo.findOne({
          where: { id: dto.parentId },
          relations: ['parent'],
        });

      if (!parent) {
        throw new NotFoundException(
          `Parent category ${dto.parentId} not found!!`,
        );
      }

      if (parent.parent) {
        throw new BadRequestException(
          'Only two level of categories are allowed.',
        );
      }

      category.parent = parent;
    } else {
      category.parent = null;
    }

    return this.productCategoryRepo.save(category);
  }

  //* ------------------------ GET ALL CATEGORY -----------------------------
  async getAll(): Promise<ProductCategory[]> {
    return await this.productCategoryRepo.find({
      // where: { id: IsNull() },
      relations: ['children'],
    });
  }

  //* ------------------------ GET ALL CATEGORY -------------------------
  async findOne(id: string) {
    const category = await this.productCategoryRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with the id ${id} not found!!!`);
    }

    return category;
  }
}
