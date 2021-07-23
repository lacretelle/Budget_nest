import {
	FunctionComponent,
	useEffect,
	useState,
	useContext,
	useRef,
} from "react";
import { Redirect } from "react-router-dom";
import { BoardContext } from "../context/board";
import isDeepEqual from "fast-deep-equal/react";
import SettingsIcon from "@material-ui/icons/Settings";
import { BudgetSetting } from "../Components/BudgetSetting";
import { BoardSettings } from "../Components/BoardSettings";
import { DashBoardExpenses } from "../Components/DashBoardExpenses";

interface BoardProps {
	history: any;
	location: any;
}

export const Board: FunctionComponent<BoardProps> = (props) => {
	const { boardInfo } = useContext(BoardContext);
	const currentBoardRef = useRef(boardInfo);
	const [isDisplayExpenseOrAdd, setIsDisplayExpenseOrAdd] = useState(false);
	const [isChangeCurrentBoard, setIsChangeCurrentBoard] = useState(false);
	const [isBoardSettings, setIsBoardSettings] = useState(false);

	useEffect(() => {
		if (isChangeCurrentBoard) {
			setIsChangeCurrentBoard(false);
		}
	}, [isChangeCurrentBoard]);
	const displayBoardSettings = () => {
		setIsBoardSettings(true);
	};
	if (!isDeepEqual(currentBoardRef.current, boardInfo)) {
		currentBoardRef.current = boardInfo;
		setIsChangeCurrentBoard(true);
	}
	if (isChangeCurrentBoard) return <Redirect to="/" />;

	return (
		<div className="board">
			{isBoardSettings ? (
				<BoardSettings />
			) : (
				<>
					<section className="settings_account">
						{boardInfo && (
							<>
								<h4>{boardInfo.title}</h4>
								{boardInfo.members && (
									<p>
										{boardInfo.members.map((e) => (
											<li className="members_label" key={e.id}>
												{e.username}
											</li>
										))}
									</p>
								)}
								<button onClick={displayBoardSettings}>
									<SettingsIcon />
								</button>
							</>
						)}
					</section>
					<section className="expense">
						<DashBoardExpenses />
					</section>
					{!isDisplayExpenseOrAdd && (
						<section className="budget_chart">
							<BudgetSetting />
						</section>
					)}
				</>
			)}
		</div>
	);
};
