import { createContext, useState } from "react";
/*
 * CONTEXT AUTHENTICATION
 * user => boards / budget
 */
export interface IUserInfo {
	username: string;
	id: string;
	mail: string;
}
export interface IBoardInfo {
	title: string;
	id: string;
	members: IUserInfo[];
}

// here to create an history
export interface IAuthContext {
	currentUser: IUserInfo | undefined;
	users: IUserInfo[] | undefined;
	setCurrentUser: (userInfo: IUserInfo | undefined) => void;
	setUsers: (userInfo: IUserInfo[]) => void;
	boardsCurrentUser: IBoardInfo[] | [];
	setBoardsCurrentUser: (boards: IBoardInfo[]) => void;
}

export const AUTH_DEFAULT = {
	currentUser: undefined,
	users: undefined,
	setCurrentUser: () => {},
	setUsers: () => {},
	boardsCurrentUser: [],
	setBoardsCurrentUser: () => {},
};

export const AuthContext = createContext<IAuthContext>(AUTH_DEFAULT);

const AuthProvider = (props: any) => {
	const [currentUser, setCurrentUser] = useState<IUserInfo | undefined>();
	const [users, setUsers] = useState<IUserInfo[] | undefined>();
	const [boardsCurrentUser, setBoardsCurrentUser] = useState<IBoardInfo[] | []>(
		[]
	);
	return (
		<AuthContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				users,
				setUsers,
				boardsCurrentUser,
				setBoardsCurrentUser,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
