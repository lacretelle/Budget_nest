import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import {
	dataEveryday,
	dataSubscription,
	dataPet,
	dataGift,
	dataSavings,
	dataTax,
	dataHome,
	dataHobby,
	dataHealth,
	dataTravel,
} from './allCategories';

@Controller('api/category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('/seedCat')
	seedDbCategory(): void {
		this.categoryService.feed([
			dataEveryday,
			dataSubscription,
			dataPet,
			dataGift,
			dataSavings,
			dataTax,
			dataHome,
			dataHobby,
			dataHealth,
			dataTravel,
		]);
	}

	@Get()
	fetchAllCategories(): Promise<Category[]> {
		return this.categoryService.findAll();
	}
}
