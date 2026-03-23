import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { ProductImage } from './entities/product-image.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
    private readonly paginationProvider: PaginationProvider,
    private readonly imageUploadService: ImageUploadService,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  //* ----------------------- ADD PRODUCT ---------------------
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    try {
      const images = await this.imageUploadService.uploadMultipleImage(
        files,
        'products',
      );

      const category = await this.categoryRepo.findOne({
        where: { id: createProductDto.categoryId },
        relations: ['children'],
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Prevent assigning product to parent category
      if (category.children && category.children.length > 0) {
        throw new BadRequestException(
          'Cannot assign product to a parent category. Use a subcategory.',
        );
      }

      const product = this.productRepo.create({
        ...createProductDto,
        images,
        category,
      });
      return await this.productRepo.save(product);
    } catch (error) {
      if (error) {
        console.log('UPLOAD ERROR', error);
        throw new Error();
      }
    }
  }

  //* ----------------------- UPDATE PRODUCT ---------------------
  async update(
    id: string,
    dto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['images', 'category'],
      });
      if (!product) throw new NotFoundException('Product not found');

      if (dto.categoryId) {
        const category = await this.categoryRepo.findOne({
          where: { id: dto.categoryId },
          relations: ['children'],
        });

        if (!category) {
          throw new NotFoundException('Category not found!!');
        }

        // PREVENT ASSIGNING TO PARENT CATEGORY
        if (category.children && category.children.length > 0) {
          throw new BadRequestException(
            'Can not assign product to a parent category. Use a subcategory.',
          );
        }

        product.category = category;
      }

      Object.assign(product, dto);

      if (files?.length) {
        // delete old images
        await Promise.all(
          product.images.map((img) =>
            this.imageUploadService.deleteImage(img.publicId),
          ),
        );

        const uploadedImages =
          await this.imageUploadService.uploadMultipleImage(files, 'products');

        product.images = uploadedImages.map((img) =>
          this.productImageRepo.create({ ...img, product }),
        );
      }
      return this.productRepo.save(product);
    } catch (error) {
      console.log('UPLOAD ERROR', error);
      throw new Error();
    }
  }

  //* ----------------------- GET ALL PRODUCT ---------------------
  async getAllProduct(
    paginationDto: PaginationDto,
    filterProductDto: FilterProductDto,
  ): Promise<Paginated<Product>> {
    const { categorySlug, minPrice, maxPrice } = filterProductDto;
    const where: any = {};
    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (minPrice && maxPrice) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice) {
      where.price = LessThanOrEqual(maxPrice);
    }

    return this.paginationProvider.paginationQuery(
      paginationDto,
      this.productRepo,
      where,
      ['category'],
    );
  }

  //* ----------------------- GET PRODUCT BY ID ---------------------
  async getProductById(productId: string) {
    return await this.productRepo.findOneBy({ id: productId });
  }

  //* ----------------------- DELETE PRODUCT ---------------------
  async deleteProduct(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(
        `Product with the id: ${productId} not found!!`,
      );
    }

    // DELETE IMAGES FORM CLOUDINARY
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) =>
          this.imageUploadService.deleteImage(img.publicId),
        ),
      );
    }

    // DELETE IMAGE RECORDS FROM PRODUCT IMAGE TABLE
    await this.productImageRepo.delete({
      product: { id: productId },
    });

    return await this.productRepo.delete(productId);
  }
}
