import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
require('dotenv').config();

// import csrf

// apply here a middleware for all route => file config to exclude routes '/auth*'
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	await app.listen(process.env['PORT']);
}
bootstrap();
