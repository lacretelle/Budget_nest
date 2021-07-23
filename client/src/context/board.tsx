import { createContext, useState } from "react";
import { IBoardInfo, IUserInfo } from "./auth";
/*
 * CONTEXT BOARD
 */
// to do budget ?
export interface ICategory {
	id: string;
	title: string;
	isMain: boolean;
	main: string;
}
export interface IExpense {
	id: string;
	title: string;
	category: ICategory;
	price: number;
	isRecurrence: boolean;
	frequency?: string;
	dateExpense: Date;
	buyer: IUserInfo;
	contributors: IUserInfo[];
}
export interface IBoard {
	boardInfo: IBoardInfo | undefined;
	expenses: IExpense[] | [];
	categories: ICategory[];
	setBoardInfo: (data: IBoardInfo) => void;
	setExpenses: (expenses: IExpense[]) => void;
	setCategories: (categories: ICategory[]) => void;
}

export const BOARD_DEFAULT = {
	boardInfo: undefined,
	expenses: [],
	categories: [],
	setBoardInfo: () => {},
	setExpenses: () => {},
	setCategories: () => {},
};

export const BoardContext = createContext<IBoard>(BOARD_DEFAULT);

export const BoardConsumer = BoardContext.Consumer;

const BoardProvider = (props: any) => {
	const [boardInfo, setBoardInfo] = useState<IBoardInfo | undefined>();
	const [expenses, setExpenses] = useState<IExpense[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);

	return (
		<BoardContext.Provider
			value={{
				boardInfo,
				setBoardInfo,
				expenses,
				setExpenses,
				categories,
				setCategories,
			}}
		>
			{props.children}
		</BoardContext.Provider>
	);
};

export default BoardProvider;
