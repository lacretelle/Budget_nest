import {
	FunctionComponent,
	useEffect,
	useState,
	useContext,
	ChangeEvent,
	MouseEvent,
} from "react";
import { BoardContext, IExpense, ICategory } from "../context/board";
import { AuthContext, IUserInfo } from "../context/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reduceArrayByAnother } from "../utils/tools";
import { isNullOrUndefined } from "../utils/constant";

// TODO :
// -> date picker format
// -> subcat !!!! ATTENTION
// price manage cause if its to erase and not other int

interface IPropsExpense {
	isNew: boolean;
	selectExpense: IExpense | undefined;
}
export const Expense: FunctionComponent<IPropsExpense> = (props) => {
	const { isNew, selectExpense } = props;
	const { boardInfo, setExpenses, categories } = useContext(BoardContext);
	const { currentUser } = useContext(AuthContext);
	const [mainCategories, setMainCategories] = useState<ICategory[]>([]);
	const [subCategories, setSubCategories] = useState<ICategory[]>([]);
	// SEE FOR THAT
	const [contributors, setContributors] = useState<IUserInfo[]>([]);

	const [isMounted, setIsMounted] = useState(false);
	const [idExp, setIdExp] = useState<string | undefined>();
	const [dateExp, setDateExp] = useState<Date>(new Date());
	const [titleExp, setTitleExp] = useState<string>("");
	const [priceExp, setPriceExp] = useState<number>();
	const [categoryExp, setCategoryExp] = useState<ICategory>();
	const [mainCatSelect, setMainCatSelect] = useState<string>();
	const [buyerExp, setBuyerExp] = useState<IUserInfo>();
	const [contributorsExp, setContributorsExp] = useState<IUserInfo[] | []>([]);
	const [contributorsProba, setContributorsProba] = useState<IUserInfo[] | []>(
		[]
	);
	const [isRecurExp, setIsRecurExp] = useState<boolean>(false);
	const [frequencyExp, setFrequencyExp] = useState<string | undefined>();

	useEffect(() => {
		const fillContributors = () => {
			if (boardInfo && boardInfo.members) setContributors(boardInfo.members);
		};
		fillContributors();
	});
	useEffect(() => {
		const fillExpenseBase = () => {
			if (currentUser && isNew) {
				let tab = [];
				tab.push(currentUser);
				setContributorsExp(tab);
				setBuyerExp(currentUser);
			}
		};
		fillExpenseBase();
	});
	useEffect(() => {
		setContributorsProba(reduceArrayByAnother(contributors, contributorsExp));
	}, [contributorsExp]);
	useEffect(() => {
		const fillSubCat = () => {
			let catMain: ICategory[] = [];
			let catSub: ICategory[] = [];
			categories.forEach((element: ICategory) => {
				if (element.isMain) catMain.push(element);
				else catSub.push(element);
			});
			setMainCategories(catMain);
			setSubCategories(catSub);
			setMainCatSelect(catMain[0].title);
			let i = categories.findIndex(
				(e) => e.main === catMain[0].title && !e.isMain
			);
			setCategoryExp(categories[i]);
		};
		fillSubCat();
	}, []);
	useEffect(() => {
		const fillSelectExp = () => {
			if (selectExpense) {
				setIdExp(selectExpense.id);
				setTitleExp(selectExpense.title);
				setDateExp(new Date(selectExpense.dateExpense));
				setPriceExp(selectExpense.price);
				setBuyerExp(selectExpense.buyer);
				setCategoryExp(selectExpense.category);
				setContributorsExp(selectExpense.contributors);
				setIsRecurExp(selectExpense.isRecurrence);
				setFrequencyExp(selectExpense.frequency);
				setMainCatSelect(selectExpense.category.main);
				setIsMounted(true);
			}
		};
		if (!isNew && !isMounted) fillSelectExp();
	});

	// HANDLE TO FILL INPUTS
	const handleDate = (date: Date) => {
		setDateExp(date);
	};
	const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
		if (typeof e.target.value === "string" && e.target.value !== null)
			setTitleExp(e.target.value);
	};
	const handlePrice = (e: string) => {
		if (!isNullOrUndefined(e)) {
			let nb = parseFloat(e);
			if (nb >= 0) setPriceExp(nb);
		}
	};
	const handleCategory = (selected: string) => {
		if (categories) {
			if (!isNullOrUndefined(selected)) {
				let index = categories.findIndex((e) => e.title === selected);
				if (index > -1) setCategoryExp(categories[index]);
			}
		}
	};
	const handleBuyer = (selected: string) => {
		if (contributorsExp) {
			if (!isNullOrUndefined(selected)) {
				let i = contributorsExp.findIndex((e) => e.id === selected);
				if (i > -1) setBuyerExp(contributorsExp[i]);
			}
		}
	};
	const handleRecurrence = (e: ChangeEvent<HTMLInputElement>) => {
		isRecurExp ? setIsRecurExp(false) : setIsRecurExp(true);
	};
	const handleFrequency = (e: string) => {
		if (!isNullOrUndefined(e)) setFrequencyExp(e);
	};
	const handleMainCategory = (title: string) => {
		if (!isNullOrUndefined(title)) setMainCatSelect(title);
		if (categories) {
			let index = subCategories.findIndex((e) => e.main === title);
			if (index > -1) {
				let select = subCategories[index].title;
				let i = categories.findIndex((e) => e.title === select);
				if (i > -1) setCategoryExp(categories[i]);
			}
		}
	};
	const removeContributors = (id: string) => {
		if (contributorsExp && !isNullOrUndefined(id)) {
			let index = contributorsExp.findIndex((e) => e.id === id);
			let tab = [...contributorsExp];
			if (index > -1) {
				tab.splice(index, 1);
				setContributorsExp(tab);
			}
		}
	};
	const addContributors = (id: string) => {
		if (contributors && !isNullOrUndefined(id)) {
			let index = contributors.findIndex((e) => e.id === id);
			if (index > -1) {
				let tab = [...contributorsExp];
				tab.push(contributors[index]);
				setContributorsExp(tab);
			}
		}
	};

	// CREATE OR UPDATE THIS EXPENSE
	const submitExpense = async (e: MouseEvent) => {
		e.preventDefault();
		if (
			boardInfo &&
			!isNullOrUndefined(titleExp) &&
			!isNullOrUndefined(priceExp) &&
			!isNullOrUndefined(frequencyExp) &&
			!isNullOrUndefined(dateExp) &&
			!isNullOrUndefined(buyerExp) &&
			!isNullOrUndefined(categoryExp) &&
			!isNullOrUndefined(boardInfo.id) &&
			!isNullOrUndefined(contributorsExp)
		) {
			let dataBody = {
				title: titleExp,
				price: priceExp,
				isRecurrence: isRecurExp,
				frequency: frequencyExp,
				dateExpense: dateExp,
				buyer: buyerExp,
				category: categoryExp,
				boardId: boardInfo.id,
				contributors: contributorsExp,
			};
			const res = idExp
				? await fetch(`/expense/${idExp}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							...dataBody,
							id: idExp,
						}),
				  })
				: await fetch(`/expense`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(dataBody),
				  });
			const data: IExpense[] = await res.json();
			if (data) setExpenses(data);
		}
	};
	return (
		<>
			<div className="item_form">
				<label> Date: </label>
				<DatePicker
					dateFormat="dd/MM/yyyy"
					selected={dateExp}
					onChange={(date: any) => handleDate(date)}
				/>
			</div>
			<div className="item_form">
				<label> Title: </label>
				<input
					type="text"
					onChange={handleTitle}
					id="name_expense"
					value={titleExp}
				/>
			</div>
			<div className="item_form">
				<label>Price: </label>
				<input
					type="number"
					step="0.01"
					defaultValue={priceExp}
					id="display_price_exp"
					onBlur={(ev: React.ChangeEvent<HTMLInputElement>): void => {
						handlePrice(ev.target.value);
					}}
				/>
			</div>
			<div className="item_form">
				<label>Category: </label>
				{mainCategories.length > 0 && (
					<select
						value={mainCatSelect}
						onChange={(ev: React.ChangeEvent<HTMLSelectElement>): void =>
							handleMainCategory(ev.target.value)
						}
					>
						{mainCategories.map((e) => (
							<option key={e.id} value={e.title}>
								{e.title}
							</option>
						))}
					</select>
				)}
				{subCategories.length > 0 && (
					<select
						value={categoryExp && categoryExp.title}
						onChange={(ev: React.ChangeEvent<HTMLSelectElement>): void =>
							handleCategory(ev.target.value)
						}
					>
						{subCategories.map((e) => {
							if (e.main === mainCatSelect)
								return (
									<option key={e.id} value={e.title}>
										{e.title}
									</option>
								);
						})}
					</select>
				)}
			</div>
			<div className="item_form">
				<label>Buyer: </label>
				{contributorsExp && buyerExp && (
					<select
						value={buyerExp.id}
						onChange={(ev: React.ChangeEvent<HTMLSelectElement>): void =>
							handleBuyer(ev.target.value)
						}
					>
						{contributorsExp.map((e: any) => (
							<option key={e.id} value={e.id}>
								{e.username}
							</option>
						))}
					</select>
				)}
			</div>
			<div className="item_form">
				<label>Is this recurrent: </label>
				<input
					type="checkbox"
					checked={isRecurExp ? true : false}
					onChange={handleRecurrence}
					id="recur_expense"
				/>
				{isRecurExp && (
					<>
						<label>Every what :</label>
						<select
							value={frequencyExp}
							onChange={(ev: React.ChangeEvent<HTMLSelectElement>): void =>
								handleFrequency(ev.target.value)
							}
						>
							<option value="day">Day</option>
							<option value="week">Week</option>
							<option value="month">Month</option>
							<option value="year">Year</option>
						</select>
					</>
				)}
			</div>
			{contributorsExp && (
				<div className="item_form">
					{contributorsExp.map((e: any) => (
						<li key={e.id} onClick={() => removeContributors(e.id)}>
							{e.username} remove it
						</li>
					))}
					{contributorsProba && contributorsProba.length > 0 && (
						<>
							<label>Choose contributors :</label>
							{contributorsProba.map((e: any) => (
								<li key={e.id} onClick={() => addContributors(e.id)}>
									{e.username}
								</li>
							))}
						</>
					)}
				</div>
			)}
			<button type="submit" onClick={submitExpense}>
				Save this expense
			</button>
		</>
	);
};
