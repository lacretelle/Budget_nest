import {
	FunctionComponent,
	useContext,
	MouseEvent,
	useState,
	useEffect,
} from "react";
import { AuthContext, IUserInfo, IBoardInfo } from "../context/auth";
import { BoardContext } from "../context/board";
import { isNullOrUndefined } from "../utils/constant";
interface IFormBoardProps {
	isNew: boolean;
}
export const FormBoard: FunctionComponent<IFormBoardProps> = (props) => {
	const { boardsCurrentUser, setBoardsCurrentUser } = useContext(AuthContext);
	const { boardInfo, setBoardInfo } = useContext(BoardContext);
	const { currentUser } = useContext(AuthContext);
	const { isNew } = props;

	const [error, setError] = useState<string>("");
	const [users, setUsers] = useState<IUserInfo[]>([]);
	const [mailSearch, setMailSearch] = useState("");
	const [isSearchSubmit, setIsSearchSubmit] = useState(false);
	const [usernameNewUser, setUsernameNewUser] = useState("");
	const [titleBoard, setTitleBoard] = useState<string>("");
	const [idBoard, setIdBoard] = useState<string>("");
	const [contributors, setContributors] = useState<IUserInfo[]>([]);

	// FETCH USERS (ALL AVAILABLE)
	useEffect(() => {
		const fetchUsers = async () => {
			const result = await fetch(`/member`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await result.json();
			if (data) setUsers(data);
		};
		fetchUsers();
	}, []);
	// FILL CONTRIBUTORS
	useEffect(() => {
		if (currentUser) {
			let tab = [...contributors];
			tab.push(currentUser);
			setContributors(tab);
		}
	}, []);
	// FILL BOARD IF UPDATE IT
	useEffect(() => {
		const fillBoard = () => {
			if (boardInfo) {
				setTitleBoard(boardInfo.title);
				setIdBoard(boardInfo.id);
				setContributors(boardInfo.members);
			}
		};
		if (!isNew) fillBoard();
	}, []);
	// HANDLE INPUT
	const handleTitle = (value: string) => {
		if (!isNullOrUndefined(value)) setTitleBoard(value);
	};
	const handleUsernameNewUser = (value: string) => {
		if (!isNullOrUndefined(value)) setUsernameNewUser(value);
	};
	const handleSearch = (value: string) => {
		if (!isNullOrUndefined(value)) setMailSearch(value);
	};
	const removeMember = (id: string) => {
		if (
			!isNullOrUndefined(id) &&
			contributors.length > 1 &&
			currentUser &&
			id !== currentUser.id
		) {
			let index = contributors.findIndex((e) => e.id === id);
			if (index > -1) {
				let tmp = [...contributors];
				tmp.splice(index, 1);
				setContributors(tmp);
			}
		}
	};
	const addNewUser = async (e: MouseEvent) => {
		e.preventDefault();
		if (!isNullOrUndefined(usernameNewUser) && !isNullOrUndefined(mailSearch)) {
			const res = await fetch(`/member`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: usernameNewUser,
					mail: mailSearch,
					isActive: false,
				}),
			});
			const data = await res.json();
			if (data && data.error) console.log("error", data.error);
			else {
				setUsernameNewUser("");
				setIsSearchSubmit(false);
				setMailSearch("");
			}
		}
	};

	// SUBMIT
	const submitBoard = async (e: MouseEvent) => {
		e.preventDefault();
		if (!isNullOrUndefined(titleBoard)) {
			let dataBody = { title: titleBoard, contributors };
			let result = idBoard
				? await fetch(`/board/${idBoard}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ ...dataBody, id: idBoard }),
				  })
				: await fetch(`/board`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(dataBody),
				  });
			const data: IBoardInfo = await result.json();
			if (!data) {
				let err = "This action is impossible, try again";
				setError(err);
			} else {
				let tab = [...boardsCurrentUser];
				if (idBoard) {
					let index = tab.findIndex((e) => e.id === idBoard);
					if (index > -1) tab.splice(index, 1);
					setBoardInfo(data);
				}
				tab.push(data);
				setBoardsCurrentUser(tab);
			}
		}
	};
	const searchSubmit = (e: MouseEvent) => {
		e.preventDefault();
		if (!isNullOrUndefined(mailSearch)) {
			console.log("mailSearch: ", mailSearch);

			let tmp = users.findIndex((e: IUserInfo) => e.mail === mailSearch);
			let isAlreadyIn = contributors.findIndex(
				(e: IUserInfo) => e.mail === mailSearch
			);
			console.log("tmp:", tmp);
			console.log("isAlreadyIn:", isAlreadyIn);

			if (tmp > -1 && isAlreadyIn < 0) {
				let tab = [...contributors];
				console.log("1- tab", tab);

				tab.push(users[tmp]);
				console.log("2- tab", tab);

				setContributors(tab);
				setMailSearch("");
			} else setIsSearchSubmit(true);
		}
	};

	return (
		<div className="form_board">
			<p>Create your new board</p>
			<div>
				<label>Enter the title: </label>
				<input
					value={titleBoard}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
						handleTitle(ev.target.value)
					}
				/>
			</div>
			<div>
				{contributors &&
					contributors.map((e: IUserInfo) => (
						<div className="member_label" key={e.id}>
							<p>{e.username}</p>
							{currentUser && currentUser.id !== e.id && (
								<p onClick={() => removeMember(e.id)}>remove</p>
							)}
						</div>
					))}
				<div className="search_bar">
					<label>Find your contributors with mail</label>
					<input
						type="text"
						value={mailSearch}
						onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
							handleSearch(ev.target.value)
						}
					/>
					{!isSearchSubmit ? (
						<>
							<button type="submit" onClick={searchSubmit}>
								Search
							</button>
						</>
					) : (
						<>
							<label>
								This user doesn't exist, so record him with this mail and enter
								an username:
							</label>
							<input
								id="valueUsername"
								type="text"
								value={usernameNewUser}
								onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
									handleUsernameNewUser(ev.target.value)
								}
							/>
							<button type="submit" onClick={addNewUser}>
								Record this new user
							</button>
						</>
					)}
				</div>
			</div>
			<button onClick={submitBoard}>
				{isNew ? "Create this new board" : "Update this board"}
			</button>
			{error && <div className="error">{error}</div>}
		</div>
	);
};
