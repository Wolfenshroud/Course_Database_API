function validOptions(options: any): boolean {
	if (!(typeof options === "object")) {
		return false;
	}

	let optionKeys: any[] = Object.keys(options); // string of keys

	if (optionKeys.length === 0 || optionKeys.length > 2) {
		// must have either 1 or 2 keys, columns and order
		return false;
	}

	const optionsKeyNames: string[] = ["COLUMNS", "ORDER"];

	for (let x of optionKeys) {
		if (!optionsKeyNames.includes(x)) {
			return false;
		}
	}

	if (optionKeys.length === 1) {
		if (optionsKeyNames[0] !== "COLUMNS") {
			return false;
		}
	} else if (optionKeys.length === 2) {
		if (optionsKeyNames[0] !== "COLUMNS") {
			return false;
		}
		if (optionsKeyNames[1] !== "ORDER") {
			return false;
		}
	}

	let columns: any = options["COLUMNS"];

	if (!validColumns(columns)) {
		return false;
	}

	if (optionKeys.length === 2) {
		if (optionKeys[1] !== "ORDER") {
			return false;
		} else {
			let order: any = options["ORDER"];
			if (!validOrder(order)) {
				return false;
			}
		}
	}
	return true;
}

function validColumns(columns: any) {
	let columnKeys = Object.keys(columns); // JUST NUMBERS ://
	// console.log("THERE ARE THE COLUNM KEYS:");
	// console.log(columnKeys);

	if (!(Array.isArray(columns))) {
		// console.log("columns is not an array");
		return false;
	}

	if (columnKeys.length === 0) {
		// console.log("no keys in columns");
		return false;
	}

	for (let key of columns) {
		// console.log("key of columns");
		// console.log(key);
		// if (!(typeof key === "string")) { //
		// 	return false;
		// }
		let keyString: string[] = key.split("_");
		// console.log(keyString);
		let datasetName: string = keyString[0];
		// console.log(datasetName);
		// TODO check that not more than 1 dataset is being referenced
		let field: string = keyString[1];
		if (!((field === "avg") || (field === "pass") || (field === "fail") || (field === "audit") ||
			(field === "year") || (field === "dept") || (field === "id") || (field === "instructor") ||
			(field === "title") || (field === "uuid"))) {
			// console.log("column field not one of expected");
			return false;
		}
	}

	return true;
}

function validOrder(order: any) {
	// let orderKeys = Object.keys(order);
	// console.log("ORDER KEY IS:");
	// console.log(orderKeys);

	if (Array.isArray(order)) {
		// console.log("order is an array");
		return false;
	}

	// console.log(order);

	let keyString: string[] = order.split("_");
	// console.log(keyString);
	let datasetName: string = keyString[0];
	// console.log(datasetName);
	// TODO check that not more than 1 dataset is being referenced
	let field: string = keyString[1];
	if (!((field === "avg") || (field === "pass") || (field === "fail") || (field === "audit") ||
		(field === "year") || (field === "dept") || (field === "id") || (field === "instructor") ||
		(field === "title") || (field === "uuid"))) {
		// console.log("order field not one of expected");
		return false;
	}

	// TODO how to check if order key is in column keys???

	return true;
}

export{validOptions};
