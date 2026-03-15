import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  NotFoundException,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //* ------------------- CREATE PRODUCT -------------------
  @Post()
  @Roles(Role.ADMIN, Role.MODERATOR)
  async addProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);

    if (product) {
      return {
        status: 'success',
        message: 'Product added successfully!!',
      };
    }
  }

  //* ------------------------ UPDATE PRODUCT -------------------
  @Patch(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );

    if (updatedProduct) {
      return {
        status: 'success',
        message: 'Product updated successfully!!',
      };
    }
  }

  //* ------------------------ GET ALL PRODUCT -------------------
  @Get()
  async getAllProducts(@Query() paginationDto: PaginationDto) {
    const data = await this.productsService.getAllProduct(paginationDto);

    return {
      status: 'success',
      data,
    };
  }

  //* ----------------------- GET PRODUCT BY ID ---------------------
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException();
    }

    return {
      status: 'success',
      data: product,
    };
  }

  //* ----------------------- DELETE PRODUCT ---------------------
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productsService.deleteProduct(id);
    if (!product) {
      throw new NotFoundException();
    }

    return {
      status: 'success',
      message: 'Product deleted successfully!!',
    };
  }
}
