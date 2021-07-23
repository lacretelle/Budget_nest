import { FunctionComponent } from "react";
import { Home } from "./Pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./utils/privateRoute";
import AuthProvider from "./context/auth";
import { Login } from "./Pages/Login";
import { Signin } from "./Pages/Signin";
import { Board } from "./Pages/Board";
import { Account } from "./Pages/Account";
import { Navbar } from "./Components/Navbar";
import BoardProvider from "./context/board";

const App: FunctionComponent = () => {
	return (
		<AuthProvider>
			<Router>
				<BoardProvider>
					<Navbar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/signin" component={Signin} />
						<PrivateRoute path="/account" component={Account} />
						<PrivateRoute path="/board" component={Board} />
					</Switch>
				</BoardProvider>
			</Router>
		</AuthProvider>
	);
};

export default App;
