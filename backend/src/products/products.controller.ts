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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import RolesGuard from 'src/auth/guard/roles.guard';
import { Public } from 'src/auth/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //* ------------------- CREATE PRODUCT -------------------
  @UseGuards(RolesGuard)
  @Post()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseInterceptors(FileInterceptor('image'))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const product = await this.productsService.create(createProductDto, file);

    if (product) {
      return {
        status: 'success',
        message: 'Product added successfully!!',
      };
    }
  }

  //* ------------------------ UPDATE PRODUCT -------------------
  @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
      file,
    );

    if (updatedProduct) {
      return {
        status: 'success',
        message: 'Product updated successfully!!',
      };
    }
  }

  //* ------------------------ GET ALL PRODUCT -------------------
  @Public()
  @Get()
  async getAllProducts(@Query() paginationDto: PaginationDto) {
    const data = await this.productsService.getAllProduct(paginationDto);
    console.log('PRODUCT DATA', data);

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
  @UseGuards(RolesGuard)
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
