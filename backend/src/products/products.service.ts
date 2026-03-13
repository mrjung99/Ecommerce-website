import {
  BadRequestException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  //* ----------------------- ADD PRODUCT ---------------------
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepo.create(createProductDto);
      return await this.productRepo.save(product);
    } catch (error) {
      if (error) {
        throw new BadRequestException();
      }
    }
  }

  //* ----------------------- UPDATE PRODUCT ---------------------
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepo.findOneBy({ id });

      if (!product) {
        throw new NotFoundException('Product not found!!');
      }

      const productToUpdate = Object.assign(product, updateProductDto);
      return await this.productRepo.save(productToUpdate);
    } catch (error) {
      console.log(error);

      if (error) {
        throw new BadRequestException();
      }
    }
  }

  //* ----------------------- GET ALL PRODUCT ---------------------
  async getAllProduct(
    paginationDto: PaginationDto,
  ): Promise<Paginated<Product>> {
    return this.paginationProvider.paginationQuery(
      paginationDto,
      this.productRepo,
    );
  }

  //* ----------------------- GET PRODUCT BY ID ---------------------
  async getProductById(productId: string) {
    return await this.productRepo.findOneBy({ id: productId });
  }

  //* ----------------------- DELETE PRODUCT ---------------------
  async deleteProduct(productId: string) {
    return await this.productRepo.delete(productId);
  }
}
