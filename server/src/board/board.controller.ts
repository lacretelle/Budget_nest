import {
	Body,
	Controller,
	Get,
	Post,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { MemberService } from '../member/member.service';

@Controller('api/board')
export class BoardController {
	constructor(
		private readonly boardService: BoardService,
		private readonly memberService: MemberService,
	) {}

	@Get()
	getAllBoards(): Promise<Board[]> {
		return this.boardService.findBoards();
	}
	@Get(':id')
	getBoardWithId(@Param('id') id: string): Promise<Board> {
		return this.boardService.findOne(id);
	}

	@Get('user/:id')
	getAllBoardsUser(@Param('id') userId: string): Promise<Board[]> {
		return this.boardService.findBoardsUser(userId);
	}

	@Post()
	async addBoard(
		@Body('title') nameBoard: string,
		@Body('contributors') members: [string],
	): Promise<Board> {
		let contributors = [];
		for (let i = 0; i < members.length; i++) {
			let user = await this.memberService.findOne(members[i]);
			if (user) contributors.push(user);
		}
		return this.boardService.add(nameBoard, contributors);
	}
	@Put('/:id')
	async updateBoard(
		@Param('id') id: string,
		@Body('title') nameBoard: string,
		@Body('contributors') members: string[],
	): Promise<Board> {
		let contributors = [];
		for (let i = 0; i < members.length; i++) {
			let user = await this.memberService.findOne(members[i]);
			if (user) contributors.push(user);
		}
		return this.boardService.update({ id, nameBoard, contributors });
	}

	@Delete('/:id')
	async removeBoard(@Param('id') boardId: string): Promise<void> {
		await this.boardService.remove(boardId);
	}
}
