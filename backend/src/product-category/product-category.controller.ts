import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import RolesGuard from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';

@Controller('categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  //* ------------------------ ADD MAIN CATEGORY ---------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('create')
  async addCategory(@Body() dto: CreateProductCategoryDto) {
    const category = await this.productCategoryService.addCategory(dto);

    return {
      status: 'success',
      category,
    };
  }

  //* ------------------------ GET PARENT CATEGORY ---------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('parent')
  async getParentCategory() {
    const parentCategory =
      await this.productCategoryService.getParentCategory();

    return {
      success: true,
      parentCategory,
    };
  }

  //* --------------- GET ALL CHILD CATEGORIES ------------------
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('children')
  async getChildCategory() {
    const childCategory = await this.productCategoryService.getChildCategory();
    return {
      success: true,
      childCategory,
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
