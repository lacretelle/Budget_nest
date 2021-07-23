export const colorCat = [
	{ title: "everyday", color: "#fae91f", opacity: "rgb(250, 233, 31, 0.3)" },
	{ title: "pet", color: "#f3901b", opacity: "rgb(243, 144, 27, 0.3)" },
	{ title: "subscription", color: "#e75d15", opacity: "rgb(231, 93, 21, 0.3)" },
	{ title: "gift", color: "#e62913", opacity: "rgb(230, 41, 19, 0.3)" },
	{ title: "savings", color: "#be368b", opacity: "rgb(190, 54, 139, 0.3)" },
	{ title: "tax", color: "#4f378d", opacity: "rgb(79, 55 141, 0.3)" },
	{ title: "home", color: "#138cc1", opacity: "rgb(19, 140, 193, 0.3)" },
	{ title: "hobby", color: "#00ada7", opacity: "rgb(0, 173, 167, 0.3)" },
	{ title: "health", color: "#12a53b", opacity: "rgb(18, 165, 59, 0.3)" },
	{ title: "travel", color: " #9bc120", opacity: "rgb(155, 193, 32, 0.3)" },
];

export const months = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
];

export const isNullOrUndefined = (target: any) => {
	if (target === null || target === undefined || target === "NaN") return true;
	return false;
};
