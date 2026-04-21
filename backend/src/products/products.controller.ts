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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/pagination/dto/pagination-query.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import RolesGuard from '../auth/guard/roles.guard';
import { Public } from '../auth/decorator/public.decorator';
import { FilterProductDto } from './dto/filter-product.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //* -------------------- CREATE PRODUCT (DIRECT UPLOAD TO CLOUDINARY) -----------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const product = await this.productsService.createProduct(dto);
    return {
      success: true,
      message: 'Product added successfully.',
      product,
    };
  }

  //* -------------------- UPDATE PRODUCT (DIRECT UPLOAD TO CLOUDINARY) -----------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const productToUpdate = await this.productsService.updateProduct(id, dto);
    return {
      success: true,
      message: 'Product updated successfully.',
      product: productToUpdate,
    };
  }

  //* ------------------------ GET ALL PRODUCT -------------------
  @Public()
  @SkipThrottle()
  @Get()
  // @ApiOperation({ summary: 'Fetch all products.' })
  // @ApiResponse({ status: 200, description: 'Products fetched successfully.' })
  async getAllProducts(
    @Query() paginationDto: PaginationDto,
    @Query() filterProductDto: FilterProductDto,
  ) {
    const products = await this.productsService.getAllProduct(
      paginationDto,
      filterProductDto,
    );

    return {
      status: 'success',
      products,
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
}
