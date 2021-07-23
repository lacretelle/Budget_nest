import { FunctionComponent } from "react";
import { FormAccount } from "../Components/FormAccount";

interface LoginProps {}

export const Login: FunctionComponent<LoginProps> = (props) => {
	return (
		<main>
			<FormAccount type="login" />
		</main>
	);
};
