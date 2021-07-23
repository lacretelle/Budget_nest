import { SetMetadata } from '@nestjs/common';

// ITS FOR PUBLIC ROUTE => @Public()
export const Public = () => SetMetadata(process.env.IS_PUBLIC_KEY, true);
export const saltOrRounds = 10;
