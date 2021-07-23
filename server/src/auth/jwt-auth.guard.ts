import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private jwtStartegy: JwtStrategy) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		let result = false;
		if (req.cookies.token) {
			let validUser = await this.jwtStartegy.validate(req.cookies.token);
			if (validUser) result = true;
		}
		return result;
		// const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
		// 	context.getHandler(),
		// 	context.getClass(),
		// ]);
		// if (isPublic) {
		// 	return true;
		// }
	}

	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
