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

  async findCategoryById(id: number): Promise<any> {
    try {
      const manager = getManager();

      const category = await manager
        .getTreeRepository(Category)
        .findOneOrFail(id);

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createNewCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
    const { name, parentId } = createCategoryDto;
    const manager = getManager();

    try {
      const category = new Category();

      const parent = await manager
        .getTreeRepository(Category)
        .findOneOrFail(parentId);

      category.name = name;
      category.parent = parent;

      await manager.save(category);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createNewCategoryRoot(): Promise<any> {
    const manager = getManager();

    try {
      const a1 = new Category();
      a1.name = 'Root';
      await manager.save(a1);

      const a11 = new Category();
      a11.name = 'Pemprov Jawa Barat';
      a11.parent = a1;
      await manager.save(a11);

      const a111 = new Category();
      a111.name = 'Dinas Komunikasi dan Informatika';
      a111.parent = a11;
      await manager.save(a111);

      const a1111 = new Category();
      a1111.name = 'Sekretariat';
      a1111.parent = a111;
      await manager.save(a1111);

      const a1112 = new Category();
      a1112.name = 'Bidang E-Government';
      a1112.parent = a111;
      await manager.save(a1112);

      const a1113 = new Category();
      a1113.name =
        'Unit Pelaksana Teknis Daerah Pusat Layanan Digital Data dan Informasi Geospasial';
      a1113.parent = a111;
      await manager.save(a1113);

      const a11131 = new Category();
      a11131.name = 'Seksi Aplikasi dan Data Digital';
      a11131.parent = a1113;
      await manager.save(a11131);

      const a111311 = new Category();
      a111311.name = 'Divisi IT Development';
      a111311.parent = a11131;
      await manager.save(a111311);

      return a1;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findTrees(request: any): Promise<any> {
    const { depth } = request.query;
    const manager = getManager();

    try {
      const trees = await manager.getTreeRepository(Category).findTrees({
        depth,
      });

      return trees;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
