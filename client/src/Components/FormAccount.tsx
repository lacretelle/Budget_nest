import {
	FunctionComponent,
	useContext,
	MouseEvent,
	useState,
	useEffect,
} from "react";
import { AuthContext } from "../context/auth";
import { Link, Redirect } from "react-router-dom";
import { isNullOrUndefined } from "../utils/constant";
export interface IFormAccountProps {
	type: string;
}
export const FormAccount: FunctionComponent<IFormAccountProps> = (props) => {
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const type = props.type;
	let listUrl = [
		{
			type: "login",
			url: `/auth/login`,
			nameButton: "Connection",
		},
		{
			type: "signin",
			url: `/auth/register`,
			nameButton: "Record and connect",
		},
		{
			type: "updateAccount",
			url: `/`,
			nameButton: "Update settings",
		},
	];
	const mailRegex = new RegExp(
		/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	);
	const passwordRegex = new RegExp(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
	);
	const objWithType = listUrl.find((e) => e.type === type);
	const [username, setUsername] = useState("");
	const [mail, setMail] = useState("");
	const [isRegMail, setIsRegMail] = useState(false);
	const [password, setPassword] = useState("");
	const [isRegPassword, setIsRegPassword] = useState(false);
	const [cfpassword, setCfpassword] = useState("");
	const [isCPassword, setIsCPassword] = useState(false);
	const [warning, setWarning] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		if (currentUser && (type === "updateAccount" || isLoggedIn)) {
			setUsername(currentUser.username);
			setMail(currentUser.mail);
		}
	});

	const handleUsername = (value: string) => {
		if (!isNullOrUndefined(value)) setUsername(value);
	};
	const handleMail = (value: string) => {
		if (!isNullOrUndefined(value)) {
			// REGEX FOR MAIL
			setMail(value);
		}
	};
	const handlePassword = (value: string) => {
		if (!isNullOrUndefined(value)) {
			// REGEX FOR PASSWORD
			setPassword(value);
		}
	};
	const handleCFPassword = (value: string) => {
		if (!isNullOrUndefined(value)) {
			setCfpassword(value);
			setIsCPassword(true);
		}
		// return setWarning("Your password not equal");
	};
	const isEqualPassword = () => {
		let bool = password.localeCompare(cfpassword) === 0 ? true : false;
		setIsCPassword(bool);
	};
	const isMailCheck = () => {
		let res = mailRegex.test(mail);
		if (res) {
			if (warning.length > 0) setWarning("");
			setIsRegMail(true);
		} else setWarning("This mail isn't a good format, test@test.fr");
	};
	const isPasswordCheck = () => {
		if (type !== "login") {
			let res = passwordRegex.test(password);
			if (res) {
				setIsRegPassword(true);
				if (warning.length > 0) setWarning("");
			} else
				setWarning(
					"Your password must contain minimum eight characters, at least one letter, one number and one special character"
				);
		}
	};

	const submitForm = async (e: MouseEvent) => {
		e.preventDefault();
		// FILL DATABODY TO POST
		let dataBody;
		if (type === "login") {
			if (!isNullOrUndefined(username) && !isNullOrUndefined(password))
				dataBody = { username, password };
		} else if (type === "signin") {
			if (
				!isNullOrUndefined(username) &&
				!isNullOrUndefined(password) &&
				!isNullOrUndefined(mail) &&
				isCPassword &&
				isRegMail &&
				isRegPassword
			)
				dataBody = { username, mail, password, isActive: true };
		} else {
			if (currentUser) {
				dataBody = { id: currentUser.id };
				if (isCPassword && isRegPassword) dataBody = { ...dataBody, password };
				if (mail !== currentUser.mail && !isNullOrUndefined(mail) && isRegMail)
					dataBody = { ...dataBody, mail };
			}
		}
		// HANDLE ERROR IF UPDATE PASSWORD
		if (password && !isCPassword && type === "updateAccount") {
			setWarning(
				'If you want to change your password, confim your new password in case "Confirm your password" either it won\'t change.'
			);
			return;
		}
		// FETCH METHOD
		if (!isNullOrUndefined(dataBody)) {
			let isUpdateMail = false;
			if (currentUser && currentUser.mail !== mail) isUpdateMail = true;
			if (
				objWithType &&
				(type !== "updateAccount" ||
					(type === "updateAccount" && (isCPassword || isUpdateMail)))
			) {
				const res = await fetch(objWithType.url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataBody),
				});
				const data = await res.json();
				if (data && !data.error) {
					setWarning("");
					if (type !== "updateAccount") {
						setIsLoggedIn(true);
						return setCurrentUser({
							username: data.username,
							id: data.id,
							mail: data.mail,
						});
					} else if (
						type === "updateAccount" &&
						currentUser &&
						mail !== currentUser.mail
					) {
						setCurrentUser({ ...currentUser, mail: data.mail });
					}
				} else setWarning("This action doesn't work, try later.");
			}
		}
	};
	if (isLoggedIn && currentUser) {
		return <Redirect to="/" />;
	}
	return (
		<form className="form_connection">
			<div className="item_form">
				<label>Your username :</label>
				<input
					type="text"
					value={username}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
						handleUsername(ev.target.value)
					}
				/>
			</div>
			{type !== "login" && (
				<div className="item_form">
					<label>Your mail :</label>
					<input
						type="text"
						value={mail}
						onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
							handleMail(ev.target.value)
						}
						onBlur={isMailCheck}
					/>
				</div>
			)}
			<div className="item_form">
				<label>Your password :</label>
				<input
					type="password"
					value={password}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
						handlePassword(ev.target.value)
					}
					onBlur={isPasswordCheck}
				/>
			</div>
			{type !== "login" && (
				<div className="item_form">
					<label>Repeat your password :</label>
					<input
						type="password"
						value={cfpassword}
						onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
							handleCFPassword(ev.target.value)
						}
						onBlur={isEqualPassword}
					/>
				</div>
			)}
			<button type="submit" onClick={submitForm}>
				{objWithType?.nameButton}
			</button>
			{warning && <div className="warning">{warning}</div>}
			{type === "login" && (
				<Link className="link" to="/signin">
					Don't have an account?
				</Link>
			)}
			{type === "signin" && (
				<Link className="link" to="/login">
					You alrealdy have an account?
				</Link>
			)}
		</form>
	);
};
