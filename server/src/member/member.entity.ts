import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Expense } from "../expense/expense.entity";

@Entity()
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: 200, unique: true })
    mail: string;

    @Column({ type: 'varchar', length: 200 })
    password: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;
    
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @OneToMany(() => Expense, expense => expense.member)
    @JoinColumn({name: 'buyer_expense'})
    expenses: Expense[];

    @ManyToMany(() => Expense)
    @JoinTable({name: 'contributors'})
    contributors: Expense[];
}