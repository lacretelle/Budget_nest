import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class BoardService {
	constructor(
		@InjectRepository(Board) private boardRepository: Repository<Board>,
	) {}

	async findBoards(): Promise<Board[]> {
		return await this.boardRepository.find();
	}

	async findBoardsUser(userId: string): Promise<Board[]> {
		let resQuery = await this.boardRepository.find({
			select: ['id', 'title'],
			relations: ['members'],
		});
		let boards = [];
		resQuery.forEach((e) => {
			let contributors = [];
			if (e.members.length > 0) {
				let indexSearch = e.members.findIndex((i) => i.id === userId);
				if (indexSearch > -1) {
					e.members.forEach((m) => {
						contributors.push({
							id: m.id,
							username: m.username,
							mail: m.mail,
						});
					});
					boards.push({ title: e.title, id: e.id, members: contributors });
				}
			}
		});
		return boards;
	}

	async add(nameBoard: string, contributors: Member[]): Promise<Board> {
		let board = new Board();
		board.title = nameBoard;
		board.members = contributors;
		try {
			board = await this.boardRepository.save(board);
			return board;
		} catch (error) {
			throw new Error(error);
		}
	}
	async update(data: {
		nameBoard: string;
		contributors: Member[];
		id: string;
	}): Promise<Board> {
		let boardTmp = await this.boardRepository.findOne(data.id);
		if (boardTmp) {
			if (boardTmp.title !== data.nameBoard) boardTmp.title = data.nameBoard;
			if (boardTmp.members !== data.contributors)
				boardTmp.members = data.contributors;
			boardTmp = await this.boardRepository.save(boardTmp);
			return boardTmp;
		}
		return;
	}

	findOne(id: string): Promise<Board> {
		return this.boardRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.boardRepository.delete(id);
	}
}
