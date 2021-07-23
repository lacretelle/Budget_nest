import {
	FunctionComponent,
	useContext,
	MouseEvent,
	useState,
	useEffect,
} from "react";
import HomeIcon from "@material-ui/icons/Home";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Link, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { BoardContext } from "../context/board";

export const Navbar: FunctionComponent = () => {
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const { boardInfo } = useContext(BoardContext);
	const [isLogOut, setIsLogOut] = useState(true);

	useEffect(() => {
		if (currentUser) setIsLogOut(false);
	}, [currentUser]);

	const handleLogout = (e: MouseEvent) => {
		setCurrentUser(undefined);
		setIsLogOut(true);
		return <Redirect to="/" />;
	};
	return (
		<nav className="navbar">
			<Link to="/">
				<HomeIcon />
			</Link>
			{!isLogOut ? (
				<div>
					{boardInfo && (
						<Link to="/">
							<DashboardIcon />
						</Link>
					)}
					<Link to="/account">
						<EditIcon />
					</Link>
					<p onClick={handleLogout}>
						<ExitToAppIcon />
					</p>
				</div>
			) : (
				<Link to="/login">Login</Link>
			)}
		</nav>
	);
};
