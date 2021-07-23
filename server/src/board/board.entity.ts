import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Member } from "../member/member.entity";
import { Expense } from "../expense/expense.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @ManyToMany(() => Member)
    @JoinTable()
    members: Member[];

		@OneToMany(() => Expense, expense => expense.category)
    expenses: Expense[];
}
