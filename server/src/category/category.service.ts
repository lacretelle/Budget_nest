import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}

	async feed(data: any[]): Promise<void> {
		data.map(async (element) => {
			element.map(async (item) => {
				let cat = new Category();
				cat.title = item.name;
				cat.isMain = item.isTitle;
				cat.main = item.main;
				await this.categoryRepository.save(cat);
			});
		});
	}

	findAll(): Promise<Category[]> {
		return this.categoryRepository.find();
	}

	findOne(id: string): Promise<Category> {
		return this.categoryRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.categoryRepository.delete(id);
	}
}
