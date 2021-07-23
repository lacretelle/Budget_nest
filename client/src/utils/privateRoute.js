import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

function PrivateRoute({ component: Component, ...rest }) {
	const { currentUser } = useContext(AuthContext);
	return (
		<Route
			{...rest}
			render={props =>
				currentUser && currentUser.id.length > 0 ? (
					<Component {...props} />
				) : (
					<Redirect to="/" />
				)
			}
		/>
	);
}

export default PrivateRoute;
