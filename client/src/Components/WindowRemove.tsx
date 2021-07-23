import { FunctionComponent, MouseEvent, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { BoardContext } from "../context/board";

export const WindowRemove: FunctionComponent = () => {
	const { boardInfo, setBoardInfo } = useContext(BoardContext);
	const { boardsCurrentUser, setBoardsCurrentUser } = useContext(AuthContext);
	let history = useHistory();

	// BLOCK REMOVE BOARD ?
	const handleRemoveBoard = async (e: MouseEvent) => {
		e.preventDefault();
		if (boardInfo) {
			let url = `/board/${boardInfo.id}`;
			if (boardInfo.members.length > 1) {
				url = `/`; // SEE LATER
			}
			try {
				await fetch(url, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				});
				let tab = [...boardsCurrentUser];
				let index = tab.findIndex((e) => e.id === boardInfo.id);
				if (index > -1) tab.splice(index, 1);
				setBoardInfo({ title: "", id: "", members: [] });
				setBoardsCurrentUser(tab);
			} catch (error) {
				console.log("error in remove board", error);
			}
		}
	};
	const handleClose = () => {
		return history.goBack();
	};

	return (
		<div className="window_remove">
			<h4>{boardInfo && boardInfo.title}</h4>
			<div>
				{boardInfo &&
					boardInfo.members.map((e: any) => <li key={e.id}>{e.username}</li>)}
			</div>
			<div className="button_two">
				<button onClick={handleRemoveBoard}>Remove this board</button>
				<button onClick={handleClose}>Cancel and Go Back</button>
			</div>
		</div>
	);
};
