import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	ManyToMany,
	ManyToOne,
	JoinColumn,
	JoinTable,
} from 'typeorm';
import { Board } from '../board/board.entity';
import { Member } from '../member/member.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Expense {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 150 })
	title: string;

	@Column({ type: 'varchar', length: 200 })
	price: string;

	@Column({ type: 'boolean', default: false })
	isRecurrence: boolean;

	@Column({ type: 'varchar', length: 50, nullable: true })
	frequency: string;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	dateExpense: Date;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createDateTime: Date;

	@UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	lastChangedDateTime: Date;

	@ManyToOne(() => Member, (member) => member.expenses)
	@JoinColumn({ name: 'buyer_id' })
	member: Member;

	@ManyToOne(() => Category, (category) => category.expenses)
	category: Category;

	@ManyToOne(() => Board, (board) => board.expenses)
	@JoinColumn({ name: 'board_id' })
	board: Board;

	@ManyToMany(() => Member)
	@JoinTable()
	members: Member[];
}
