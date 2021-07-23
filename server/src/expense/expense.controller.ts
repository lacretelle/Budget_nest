import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { Member } from '../member/member.entity';
import { Category } from '../category/category.entity';
import { MemberService } from '../member/member.service';

@Controller('api/expense')
export class ExpenseController {
	constructor(
		private readonly expenseService: ExpenseService,
		private readonly memberService: MemberService,
	) {}

	@Get('/:boardId')
	async getAllExpenses(
		@Param('boardId') boardId: string,
	): Promise<Expense[] | []> {
		return await this.expenseService.findAllInBoard(boardId);
	}

	@Get(':id')
	async getExpense(@Param('id') id: string): Promise<Expense> {
		return await this.expenseService.findOne(id);
	}

	@Post()
	async createExpense(
		@Body('title') title: string,
		@Body('price') price: number,
		@Body('isRecurrence') isRecurrence: boolean,
		@Body('frequency') frequency: string,
		@Body('dateExpense') dateExpense: Date,
		@Body('buyer') member: Member,
		@Body('category') category: Category,
		@Body('boardId') boardId: string,
		@Body('contributors') members: Member[],
	): Promise<Expense[]> {
		let data = {
			title,
			price,
			isRecurrence,
			frequency,
			dateExpense,
			member,
			category,
			boardId,
		};
		let contributors = [];
		for (let i = 0; i < members.length; i++) {
			let user = await this.memberService.findOne(members[i].id);
			if (user) contributors.push(user);
		}
		return this.expenseService.addOne({ ...data, contributors });
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body('title') title: string,
		@Body('price') price: number,
		@Body('isRecurrence') isRecurrence: boolean,
		@Body('frequency') frequency: string,
		@Body('dateExpense') dateExpense: Date,
		@Body('buyer') member: Member,
		@Body('category') category: Category,
		@Body('boardId') boardId: string,
		@Body('contributors') members: Member[],
	): Promise<Expense[]> {
		let data: any = {
			title,
			price,
			isRecurrence,
			frequency,
			dateExpense,
			member,
			category,
			boardId,
		};
		let contributors = [];
		for (let i = 0; i < members.length; i++) {
			let user = await this.memberService.findOne(members[i].id);
			if (user) contributors.push(user);
		}
		return await this.expenseService.updateOne(id, { ...data, contributors });
	}

	@Delete(':id')
	async removeExpense(@Param('id') id: string): Promise<void> {
		return await this.expenseService.remove(id);
	}
}
