import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  async getAllCategories(): Promise<any> {
    const manager = getManager();

    try {
      const trees = await manager.getTreeRepository(Category).findTrees();
      return trees;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createNewCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
    const { name } = createCategoryDto;
    const manager = getManager();

    try {
      const a1 = new Category();
      a1.name = name;
      await manager.save(a1);

      const a11 = new Category();
      a11.name = 'a11';
      a11.parent = a1;
      await manager.save(a11);

      const a12 = new Category();
      a12.name = 'a12';
      a12.parent = a1;
      await manager.save(a12);

      const a111 = new Category();
      a111.name = 'a111';
      a111.parent = a11;
      await manager.save(a111);

      const a112 = new Category();
      a112.name = 'a112';
      a112.parent = a11;
      await manager.save(a112);

      return a1;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findTrees(request: any): Promise<any> {
    const { depth } = request.query;

    console.log(depth);
    const manager = getManager();

    try {
      const trees = await manager
        .getTreeRepository(Category)
        .findTrees({ depth });
      return trees;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
