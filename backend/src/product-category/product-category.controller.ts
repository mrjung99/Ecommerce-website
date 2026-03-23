import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import RolesGuard from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  //* ------------------------ ADD MAIN CATEGORY ---------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  async addCategory(@Body() dto: CreateProductCategoryDto) {
    const category = await this.productCategoryService.addCategory(dto);

    return {
      status: 'success',
      category,
    };
  }

  //* ------------------------ GET ALL CATEGORY ---------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get()
  async getAllCategory() {
    const categories = await this.productCategoryService.getAll();
    return {
      status: 'success',
      categories,
    };
  }

  //* ------------------------ FIND CATEGORY ---------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = this.productCategoryService.findOne(id);
    return {
      status: 'success',
      category,
    };
  }
}
