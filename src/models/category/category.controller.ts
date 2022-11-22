import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
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

  // Error nested-set happen when put param first without prefix
  @Get('/id/:id')
  async findCategoryById(
    @Param('id') id: number,
    @Res() response,
  ): Promise<any> {
    const category = await this.categoryService.findCategoryById(id);

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: category,
    });
  }

  @Post()
  async createNewCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() response: Response,
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
  async createNewCategoryRoot(@Res() response): Promise<any> {
    const category = await this.categoryService.createNewCategoryRoot();

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: category,
    });
  }
}
