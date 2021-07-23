import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	OneToMany,
} from 'typeorm';
import { Expense } from '../expense/expense.entity';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 150, unique: true })
	title: string;

	@Column({ type: 'boolean', default: false })
	isMain: boolean;

	@Column({ type: 'varchar', length: 50 })
	main: string;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createDateTime: Date;

	@UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	lastChangedDateTime: Date;

	@OneToMany(() => Expense, (expense) => expense.category)
	expenses: Expense[];
}
