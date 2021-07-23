import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { saltOrRounds } from './constant';

@Injectable()
export class AuthService {
	constructor(
		private memberService: MemberService,
		private jwtService: JwtService,
	) {}

	async register(
		name: string,
		mail: string,
		password: string,
		isActive: boolean,
	): Promise<any> {
		let hash = await bcrypt.hash(password, saltOrRounds);
		const member = await this.memberService.add(name, mail, hash, isActive);
		if (!member) throw new UnauthorizedException();
		else {
			return this.login(member);
		}
	}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.memberService.findByUsername(username);
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

	login(user: any): { token: string; user: any } {
		const payload = { sub: user.id, username: user.username };
		const token = this.jwtService.sign(payload);
		return { token, user };
	}
}
