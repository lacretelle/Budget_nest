import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './member.entity';

@Controller('api/member')
export class MemberController {
	constructor(private readonly memberService: MemberService) {}
	@Get(':mail')
	getMember(@Param('mail') mail: string): Promise<Member> {
		return this.memberService.findByMail(mail);
	}

	@Get()
	getAllMembers() {
		return this.memberService.findAll();
	}

	@Post()
	addMember(
		@Body('name') name: string,
		@Body('mail') mail: string,
		@Body('isActive') isActive: boolean,
	) {
		let hash = 'test';
		return this.memberService.add(name, mail, hash, isActive);
	}

	@Delete()
	removeMember(@Body('id') id: string): void {
		this.memberService.remove(id);
	}
}
