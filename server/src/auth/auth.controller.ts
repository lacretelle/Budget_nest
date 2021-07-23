import {
	Request,
	Controller,
	Post,
	UseGuards,
	Get,
	Body,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req, @Res({ passthrough: true }) response) {
		const { token, user } = this.authService.login(req.user);
		response.cookie('token', token, { httpOnly: true });
		return user;
	}

	@Post('register')
	async signin(
		@Body('username') name: string,
		@Body('mail') mail: string,
		@Body('password') password: string,
		@Body('isActive') isActive: boolean,
	) {
		return this.authService.register(name, mail, password, isActive);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log('hello ^^');

		return 'ok top';
	}
	@Get()
	getTest() {
		return "hey what'su up";
	}
}

// SEE IF JWT GUARD IS OK FOR A MIDDLEWARE VALIDATION TO CHECK JWT TOKEN
// SEARCH BEARER AUTHENTICATION ???
