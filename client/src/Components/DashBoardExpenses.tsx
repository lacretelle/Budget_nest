import {
	FunctionComponent,
	useEffect,
	useState,
	useContext,
	useRef,
} from "react";

import LoopIcon from "@material-ui/icons/Loop";
import LabelIcon from "@material-ui/icons/Label";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { BoardContext, IExpense, ICategory } from "../context/board";
import { Expense } from "../Components/Expense";
import { months, colorCat } from "../utils/constant";
import { capitalizeFirstLetter } from "../utils/tools";
import Moment from "moment";
import DatePicker from "react-datepicker";
import isDeepEqual from "fast-deep-equal/react";

export const DashBoardExpenses: FunctionComponent = () => {
	const { boardInfo, expenses, setExpenses, setCategories } = useContext(
		BoardContext
	);
	const currentDate = new Date();
	const expensesRef = useRef(expenses);
	const [isNew, setIsNew] = useState(false);
	const [selectExpense, setSelectExpense] = useState<IExpense | undefined>();
	const [isDisplayExpenseOrAdd, setIsDisplayExpenseOrAdd] = useState(false);
	const [isExpensesChange, setIsExpensesChange] = useState(false);
	const [monthFilter, setMonthFilter] = useState("");
	const [yearFilter, setYearFilter] = useState(currentDate);
	const [expensesFilter, setExpensesFilter] = useState<IExpense[]>();

	/* UTILS */
	const filterYearExpenses = (yearFilter: number, expenses: IExpense[]) => {
		let newExpenses: IExpense[] = [];
		expenses.forEach((e) => {
			let yearExp = new Date(e.dateExpense).getFullYear();
			if (yearFilter === yearExp) newExpenses.push(e);
		});
		console.log("enter here filterYearExpenses", newExpenses);
		return newExpenses;
	};
	const fillColor = (category: string, isOpacity: boolean) => {
		let index = colorCat.findIndex((e) => e.title === category);
		if (index > -1)
			return isOpacity ? colorCat[index].opacity : colorCat[index].color;
	};

	/* USE EFFECT */
	// FETCH EXPENSES
	useEffect(() => {
		const fetchExpenses = async () => {
			if (boardInfo) {
				const result = await fetch(`/expense/${boardInfo.id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await result.json();
				if (data) {
					setExpenses(data);
					setExpensesFilter(
						filterYearExpenses(currentDate.getFullYear(), data)
					);
				}
			}
		};
		fetchExpenses();
	}, []);
	// FETCH CATEGORIES
	useEffect(() => {
		const fetchCategories = async () => {
			const res = await fetch(`/category`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});
			const data: ICategory[] = await res.json();
			if (data) setCategories(data);
		};
		fetchCategories();
	}, []);
	useEffect(() => {
		if (isExpensesChange) {
			if (
				!isDeepEqual(
					expensesFilter,
					filterYearExpenses(yearFilter.getFullYear(), expenses)
				)
			)
				setExpensesFilter(
					filterYearExpenses(yearFilter.getFullYear(), expenses)
				);
			setIsDisplayExpenseOrAdd(false);
			setIsNew(false);
			setIsExpensesChange(false);
		}
	}, [isExpensesChange]);

	/* GETTER - SETTER*/
	const displayExpense = (id: string) => {
		let index = expenses.findIndex((e) => e.id === id);
		if (index > -1) {
			setIsDisplayExpenseOrAdd(true);
			setIsNew(false);
			setSelectExpense(expenses[index]);
		}
	};
	const removeExpense = async (id: string) => {
		try {
			await fetch(`/expense/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			let index = expenses.findIndex((e) => e.id === id);
			if (index > -1) {
				let tab = [...expenses];
				tab.splice(index, 1);
				setExpenses(tab);
			}
		} catch (error) {
			console.log("Error in remove Expense", error);
		}
	};
	const addExpense = () => {
		setIsDisplayExpenseOrAdd(true);
		setIsNew(true);
	};
	// NEXT FEATURE ADD FILTER ON MONTHES
	// const handleSelectMonth = (month: string) => {
	// 	setMonthFilter(month);
	// };
	const handleSelectYear = (e: any) => {
		let yearSelect = e.getFullYear();
		setExpensesFilter(filterYearExpenses(yearSelect, expenses));
		setYearFilter(e);
	};

	// COMPARE TO UPDATE LIST OF EXPENSES WE SHOW
	if (!isDeepEqual(expensesRef.current, expenses)) {
		expensesRef.current = expenses;
		setIsExpensesChange(true);
	}

	return (
		<>
			{isDisplayExpenseOrAdd ? (
				<Expense isNew={isNew} selectExpense={selectExpense} />
			) : (
				<>
					<div className="filter_expenses">
						<h3>Choose display month and/or year specific</h3>
						{/* FROM YEAR CURRENTLY To 2018 */}
						<DatePicker
							selected={yearFilter}
							onChange={handleSelectYear}
							maxDate={currentDate}
							showYearPicker
							dateFormat="yyyy"
						/>
						{/* <select
								value={monthFilter}
								onChange={(ev: React.ChangeEvent<HTMLSelectElement>): void =>
									handleSelectMonth(ev.target.value)
								}
							>
								{months.map((e: string, index) => {
									return <option key={index}>{e}</option>;
								})}
							</select> */}
					</div>
					<div className="list_expenses">
						{expensesFilter && expensesFilter.length > 0 ? (
							<div>
								{expensesFilter.map((e: IExpense) => (
									<li
										key={e.id}
										style={{
											backgroundColor: fillColor(e.category.main, true),
										}}
									>
										<span
											style={{ color: fillColor(e.category.main, false) }}
											className="icon_label"
										>
											<LabelIcon />
										</span>
										<p id="dat_exp">
											{Moment(e.dateExpense).format("DD/MM/YYYY")}{" "}
											{e.isRecurrence && (
												<span
													className="icon_reccurrence"
													style={{ color: fillColor(e.category.main, false) }}
												>
													<LoopIcon /> {capitalizeFirstLetter(e.frequency)}
												</span>
											)}
										</p>
										<p id="name_exp">{e.title}</p>
										<p id="price_exp">{e.price}€</p>
										<div className="button_expenses">
											<button onClick={() => displayExpense(e.id)}>
												<EditIcon />
											</button>
											<button onClick={() => removeExpense(e.id)}>
												<DeleteIcon />
											</button>
										</div>
									</li>
								))}
							</div>
						) : (
							<p>Sorry there isn't any expenses for this selection</p>
						)}
					</div>
					<button onClick={addExpense}>Add a new expense</button>
				</>
			)}
		</>
	);
};
