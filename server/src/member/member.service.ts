import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
	constructor(
		@InjectRepository(Member) private memberRepository: Repository<Member>,
	) {}
	// PASSWORD TO BCRYPT NOT DO YET
	async add(
		name: string,
		mail: string,
		hash: string,
		isActive: boolean,
	): Promise<Member> {
		try {
			let user = new Member();
			user.username = name;
			user.mail = mail;
			user.password = hash;
			user.isActive = isActive;
			return await this.memberRepository.save(user);
		} catch (error) {
			throw new Error(error);
		}
	}

	async findAll(): Promise<Member[]> {
		return await this.memberRepository.find({
			select: ['id', 'mail', 'username'],
		});
	}

	findOne(id: string): Promise<Member> {
		return this.memberRepository.findOne(id);
	}

	async findByMail(mail: string): Promise<Member | undefined> {
		return await this.memberRepository.findOne({ where: { mail } });
	}
	async findByUsername(username: string): Promise<Member> {
		return await this.memberRepository.findOne({ where: { username } });
	}

	async remove(id: string): Promise<void> {
		await this.memberRepository.delete(id);
	}
}
