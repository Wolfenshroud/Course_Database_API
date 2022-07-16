// let allNames: string[];
// let columnFields: string[];

import {validWhere} from "./validateWhere";
import {validOptions} from "./validateOptions";


const isQueryValid = (unknownQuery: unknown) => {
	// console.log("got here now");
	let query: any;
	if (typeof unknownQuery === "object") {
		if (unknownQuery !== null) {
			query = unknownQuery;
		} else {
			// console.log("query was null");
			return false;
		}
	} else if (typeof unknownQuery === "string") {
		query = JSON.parse(unknownQuery);
	} else {
		// console.log("Not a string");
		return false;
	}

	// console.log("valid json");

	const queryKeyNames: string[] = ["WHERE", "OPTIONS"];

	let queryKeys: any[] = Object.keys(query);
	// console.log( queryKeys); // check that these are only WHERE and OPTIONS,

	if (!checkQuery(query, queryKeys, queryKeyNames)) { // check query keys
		return false;
	}

	let where: any = query["WHERE"];

	let options: any = query["OPTIONS"];

	if (!validWhere(where)) {
		// console.log("something in where was wrong");
		// console.log(allNames);
		return false;
	}
	// console.log(allNames);

	if (!validOptions(options)) {
		// console.log("something in options was wrong");
		return false;
	}

	return true;
};

function checkQuery(query: any, queryKeys: string[], queryKeyNames: string[]) {
	for (let x of queryKeys) {
		if (!queryKeyNames.includes(x)) {
			// console.log("Query keys included something other than 2 expected");
			return false;
		}
	}

	if (queryKeys.length !== 2) {
		// console.log("query didn't have exactly 2 keys");
		return false;
	}

	if (!("WHERE" in query)) {
		// console.log("where was not one of the keys in query");
		return false;
	}

	if (!("OPTIONS" in query)) {
		// console.log("options was not one of the keys in query");
		return false;
	}

	if (queryKeys[0] !== "WHERE") {
		// console.log("where was not the first key in query");
		return false;
	}

	if (queryKeys[1] !== "OPTIONS") {
		// console.log("options was not the second key in query");
		return false;
	}

	return true;
}

export {isQueryValid};
