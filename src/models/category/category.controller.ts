import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(@Res() response): Promise<any> {
    const categories = await this.categoryService.getAllCategories();

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: categories,
    });
  }

  @Post()
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() response,
  ): Promise<any> {
    const category = await this.categoryService.createNewCategory(
      createCategoryDto,
    );

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: category,
    });
  }

  @Get('find-tress')
  async findTress(@Req() request, @Res() response): Promise<any> {
    const treeCategoriesWithLimitedDepth = await this.categoryService.findTrees(
      request,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: treeCategoriesWithLimitedDepth,
    });
  }

  @Post('root')
  async createNewCategoryRoot(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() response,
  ): Promise<any> {
    const category = await this.categoryService.createNewCategoryRoot(
      createCategoryDto,
    );

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: category,
    });
  }
}
