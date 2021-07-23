export const reduceArrayByAnother = (arr1: any, arr2: any) => {
	let tmp: any[] = [];
	arr1.map((t: any) => {
		if (arr2.findIndex((e: any) => e.id === t.id) <= -1) tmp.push(t);
	});
	return tmp;
};

export const capitalizeFirstLetter = (
	[first, ...rest]: any,
	locale = navigator.language
) => first.toLocaleUpperCase(locale) + rest.join("");
