import {
	FunctionComponent,
	useEffect,
	useState,
	useRef,
	MouseEvent,
	useContext,
} from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Redirect, Link } from "react-router-dom";
import isDeepEqual from "fast-deep-equal/react";
import { AuthContext, IBoardInfo } from "../context/auth";
import { BoardContext } from "../context/board";
import { FormBoard } from "../Components/FormBoard";

export const Home: FunctionComponent = () => {
	const { currentUser, boardsCurrentUser, setBoardsCurrentUser } = useContext(
		AuthContext
	);
	const { setBoardInfo } = useContext(BoardContext);
	const boardsUserRef = useRef(boardsCurrentUser);
	const [isDisplayFormBoard, setIsDisplayFormBoard] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [selectedBoard, setSelectedBoard] = useState<string>("");
	const [isBoardsChange, setIsBoardsChange] = useState(false);

	// FETCH BOARDS EN FONCTION USERID
	useEffect(() => {
		const fetchBoards = async () => {
			if (currentUser) {
				const result = await fetch(`/board/user/${currentUser.id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await result.json();
				if (data) setBoardsCurrentUser(data);
				if (isDisplayFormBoard) setIsDisplayFormBoard(false);
			}
		};
		fetchBoards();
	}, []);
	// IF BOARD CHANGE, REFRESH FRONT
	useEffect(() => {
		if (isBoardsChange) {
			setSelectedBoard("");
			setIsDisplayFormBoard(false);
			setIsBoardsChange(false);
		}
	}, [isBoardsChange]);

	const displayFormAddBoard = (e: MouseEvent) => {
		setIsDisplayFormBoard(true);
	};
	const closeBoard = (e: MouseEvent) => {
		setIsDisplayFormBoard(false);
	};
	const displayBoard = (id: string | undefined) => {
		if (id) {
			let index = boardsCurrentUser.findIndex((e) => e.id === id);
			if (index > -1) {
				setSelectedBoard(id);
				return setBoardInfo({
					title: boardsCurrentUser[index].title,
					id: boardsCurrentUser[index].id,
					members: boardsCurrentUser[index].members,
				});
			}
		}
		return setError("This board doesn't exist");
	};

	if (selectedBoard.length > 0)
		return <Redirect to={`/board/${selectedBoard}`} />;
	if (!isDeepEqual(boardsUserRef.current, boardsCurrentUser)) {
		boardsUserRef.current = boardsCurrentUser;
		setIsBoardsChange(true);
	}

	return (
		<main className="home">
			{currentUser && currentUser.id ? (
				<article>
					{error && <div className="error">{error}</div>}
					{isDisplayFormBoard ? (
						<>
							<FormBoard isNew={true} />
							<button onClick={closeBoard}>Close</button>
						</>
					) : (
						<>
							{boardsCurrentUser &&
								boardsCurrentUser.map((board: IBoardInfo) => (
									<li onClick={() => displayBoard(board.id)} key={board.id}>
										<DashboardIcon /> {board.title}
									</li>
								))}
							<button onClick={displayFormAddBoard}> Add a new board </button>
						</>
					)}
				</article>
			) : (
				<>
					<Link className="link" to="/signin">
						Signin
					</Link>
					<Link className="link" to="/login">
						Login
					</Link>
				</>
			)}
		</main>
	);
};
