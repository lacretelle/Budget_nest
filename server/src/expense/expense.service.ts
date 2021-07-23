import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';

@Injectable()
export class ExpenseService {
	constructor(
		@InjectRepository(Expense) private expenseRepository: Repository<Expense>,
	) {}

	async addOne(data: any): Promise<Expense[]> {
		let exp = new Expense();
		exp.title = data.title;
		exp.price = data.price;
		exp.isRecurrence = data.isRecurrence;
		exp.frequency = data.frequency;
		exp.dateExpense = data.dateExpense;
		exp.member = data.member;
		exp.category = data.category;
		exp.board = data.boardId;
		exp.members = data.contributors;
		await this.expenseRepository.save(exp);
		return this.findAllInBoard(data.boardId);
	}
	async updateOne(id: string, data: any): Promise<Expense[]> {
		let tmpExp = await this.expenseRepository.findOne({
			relations: ['member', 'category', 'members'],
			where: { id },
		});
		if (tmpExp) {
			if (tmpExp.title !== data.title) tmpExp.title = data.title;
			if (tmpExp.price !== data.price) tmpExp.price = data.price;
			if (tmpExp.isRecurrence !== data.isRecurrence)
				tmpExp.isRecurrence = data.isRecurrence;
			if (tmpExp.frequency !== data.frequency)
				tmpExp.frequency = data.frequency;
			if (tmpExp.dateExpense !== data.dateExpense)
				tmpExp.dateExpense = data.dateExpense;
			if (tmpExp.member !== data.member) tmpExp.member = data.member;
			if (tmpExp.category !== data.category) tmpExp.category = data.category;
			if (tmpExp.board !== data.board) tmpExp.board = data.board;
			if (tmpExp.members !== data.contributors)
				tmpExp.members = data.contributors;
		}
		await this.expenseRepository.save(tmpExp);
		return this.findAllInBoard(data.boardId);
	}

	async findAll(): Promise<Expense[]> {
		return this.expenseRepository.find();
	}

	// GET EN FONCTION DUNE CLE ETRANGERE
	async findAllInBoard(boardId: string): Promise<Expense[]> {
		let result = await this.expenseRepository.find({
			relations: ['member', 'category', 'members'],
			where: { board: boardId },
		});
		let lastTab = [];
		result.forEach((item) => {
			let contributors = [];
			item.members.forEach((e) =>
				contributors.push({
					username: e.username,
					id: e.id,
					mail: e.mail,
				}),
			);
			let buyer = {
				username: item.member.username,
				id: item.member.id,
				mail: item.member.mail,
			};
			let cat = {
				title: item.category.title,
				id: item.category.id,
				isMain: item.category.isMain,
				main: item.category.main,
			};
			let tmp = {
				id: item.id,
				title: item.title,
				price: item.price,
				dateExpense: item.dateExpense,
				buyer,
				category: cat,
				frequency: item.frequency,
				isRecurrence: item.isRecurrence,
				contributors,
			};
			lastTab.push(tmp);
		});
		lastTab.sort(this.compare);
		return lastTab;
	}
	async findOne(id: string): Promise<Expense> {
		return await this.expenseRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.expenseRepository.delete(id);
	}

	compare(a, b) {
		// Use toUpperCase() to ignore character casing
		const dateA = a.dateExpense;
		const dateB = b.dateExpense;
		let comparison = 0;
		if (dateA > dateB) {
			comparison = -1;
		} else if (dateA < dateB) {
			comparison = 1;
		}
		return comparison;
	}
}
