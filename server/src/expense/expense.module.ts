import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { MemberModule } from 'src/member/member.module';

@Module({
	imports: [TypeOrmModule.forFeature([Expense]), MemberModule],
	controllers: [ExpenseController],
	providers: [ExpenseService],
})
export class ExpenseModule {}
