import { FunctionComponent, useEffect, useState, useContext } from "react";
import { VictoryPie } from "victory";
import { BoardContext, IExpense } from "../context/board";
import { colorCat } from "../utils/constant";
// A VOIR COMMENT FAIRE POUR AFFICHER EXPENSES FILTER => THINK ABOUT IT
export const BudgetSetting: FunctionComponent = () => {
	const { expenses, categories } = useContext(BoardContext);
	const [mapOfCat, setMapOfCat] = useState([]);
	const [useColor, setUseColor] = useState([]);

	useEffect(() => {
		if (categories) {
			let tab = categories.filter((e) => e.isMain === true);
			if (expenses && expenses.length > 0) {
				let tmp: any = [];
				let tColor: any = [];
				let sizeTotal = expenses.length;
				const expCount = (arr: IExpense[], catTitle: string) =>
					arr.reduce((a, v) => (v.category.main === catTitle ? a + 1 : a), 0);
				tab.forEach((cat) => {
					let title = cat.title;
					let c = expCount(expenses, title);
					if (c > 0) {
						tmp.push({ x: title, y: (c / sizeTotal) * 450 });
					}
				});
				tmp.sort((a: any, b: any) => {
					return b.y - a.y;
				});
				tmp.forEach((e: any) => {
					let f = colorCat.findIndex((item) => item.title === e.x);
					tColor.push(colorCat[f].color);
				});
				setMapOfCat(tmp);
				setUseColor(tColor);
			}
		}
	}, [expenses, categories]);

	return (
		<div className="pie_chart">
			{expenses.length > 0 && mapOfCat && mapOfCat.length > 0 && (
				<VictoryPie
					data={mapOfCat}
					labelRadius={() => 65}
					innerRadius={30}
					style={{
						labels: { fill: "black", fontSize: 20 },
					}}
					animate={{
						duration: 2000,
					}}
					colorScale={useColor}
				/>
			)}
		</div>
	);
};
