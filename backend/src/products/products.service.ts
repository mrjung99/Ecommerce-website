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
import { PaginationDto } from '../common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from '../common/pagination/pagination.provider';
import { Paginated } from '../common/pagination/pagination.interface';
import { ProductImage } from './entities/product-image.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger(ProductsService.name);

  //! ======================== for direct upload to cloudinary ========================
  //* ----------------------- CREATE PRODUCT --------------------------------
  async createProduct(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found!!');
    }

    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Cannot assign product to parent category.',
      );
    }

    const images = await Promise.all(
      dto.images.map((img) => this.productImageRepo.save(img)),
    );

    const product = this.productRepo.create({
      ...dto,
      category,
      images,
    });

    return await this.productRepo.save(product);
  }

  //* --------------------------- UPDATE PRODUCT ------------------------------
  async updateProduct(productId: string, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['images', 'category'],
    });

    if (!product) throw new NotFoundException('Product not found!!');

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
        relations: ['children'],
      });

      if (!category) throw new NotFoundException('Category not found!');
      if (category.children && category.children.length > 0)
        throw new BadRequestException(
          'Cannot assign product to parent category.',
        );

      product.category = category;
    }

    if (dto.images && dto.images.length > 0) {
      // delete all old image from cloudinary
      await Promise.all(
        product.images.map((img) =>
          this.cloudinaryService.deleteImageFromCloudinary(img.publicId),
        ),
      );

      // delete previous images from db
      await this.productImageRepo.delete({ product: { id: productId } });

      product.images = dto.images.map((img) =>
        this.productImageRepo.create({ ...img, product }),
      );
    }

    Object.assign(product, dto);
    delete (product as any).images;
    delete (product as any).category;
    return await this.productRepo.save(product);
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
}
