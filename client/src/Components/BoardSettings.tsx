import { FunctionComponent, useState, useContext } from "react";
import { WindowRemove } from "../Components/WindowRemove";
import { FormBoard } from "../Components/FormBoard";
import DeleteIcon from "@material-ui/icons/Delete";

//DO THE CSS
export const BoardSettings: FunctionComponent = () => {
	const [isWindowRemove, setIsWindowRemove] = useState(false);

	const displayWindowRemove = () => {
		setIsWindowRemove(true);
	};
	return (
		<section className="settings_account">
			{isWindowRemove ? (
				<WindowRemove />
			) : (
				<>
					<FormBoard isNew={false} />
					<button onClick={displayWindowRemove}>
						<DeleteIcon />
					</button>
				</>
			)}
		</section>
	);
};
