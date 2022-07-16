function validWhere(where: any): boolean {
	if (Array.isArray(where)) {
		// console.log("where was an array");
		return false;
	}

	if (typeof where === "string") {
		// console.log("where was a string");
		return false;
	}

	if (!(typeof where === "object")) {
		// console.log("where was not an object");
		return false;
	}

	let whereKeys: any[] = Object.keys(where);

	if (whereKeys.length === 0) {
		// console.log("no where keys, include all sections");
		return true;
	}

	if (whereKeys.length > 1) {
		// console.log("where had more than 1 key");
		return false;
	}

	// console.log(whereKeys[0]);
	if (!validFilter(where)) {
		return false;
	}
	return true;
}

function validFilter(filter: any): boolean {
	let filterKeys: any[] = Object.keys(filter);
	let key = filterKeys[0];
	let bo: boolean = false;
	// console.log(key);
	if (key === "IS") {
		bo = checkIS(filter);
	} else if (key === "NOT") {
		// console.log("checking NOT");
		bo = checkNOT(filter);
	} else if (key === "AND") {
		// console.log("checking AND");
		bo = checkAND(filter);
	} else if (key === "OR") {
		// console.log("checking OR");
		bo = checkOR(filter);
	} else if (key === "GT") {
		// console.log("checking GT");
		bo = checkGT(filter);
	} else if (key === "LT") {
		// console.log("checking LT");
		bo = checkLT(filter);
	} else if (key === "EQ") {
		// console.log("checking EQ");
		bo = checkEQ(filter);
	} else {
		// console.log(key);
		// console.log("NOT VALID FILTER NAME???");
		return false;
	}
	return bo;
}

function checkIS(filter: any): boolean {
	let is: any = filter["IS"];
	let isKeys: any[] = Object.keys(is);
	if (!(typeof is === "object")) {
		// console.log("is is not an object");
		return false;
	}

	let sKeys: any[] = Object.keys(is); // idstring '_' sfield
	if (sKeys.length !== 1) {
		// console.log("is has more than one skey");
		return false;
	}

	let sKey = sKeys[0];
	let sKeyArray: string[] = sKey.split("_");
	let sKeyDataset: string = sKeyArray[0];
	// TODO check that not more than 1 dataset is being referenced
	let sKeySField: string = sKeyArray[1];
	if (!((sKeySField === "dept") ||
		(sKeySField === "id") ||
		(sKeySField === "instructor")  ||
		(sKeySField === "title") ||
		(sKeySField === "uuid"))) {
		// console.log("SField not one of expected");
		return false;
	}

	let inputString: any = is[sKey];

	if (typeof inputString !== "string") {
		// console.log("inputString is not of type string");
		return false;
	}
	// TODO how to validate inputString EBNF??
	return true;
}

function checkNOT(filter: any): boolean {
	let not: any = filter["NOT"];
	let notKeys: any[] = Object.keys(not);

	// console.log(notKeys);

	if (!(typeof not === "object")) {
		// console.log("not not an object");
		return false;
	}

	if (notKeys.length !== 1) {
		// console.log("not has other than 1 filter");
		return false;
	}
	return validFilter(not);
}

function checkAND(filter: any): boolean {
	let and: any[] = filter["AND"]; // or is an array of objects, not an object??
	let andKeys: any[] = Object.keys(and); // dont use object.keys on an array
	if (!(Array.isArray(and))) {
		// console.log("and isn't an array");
		return false;
	}

	if (andKeys.length === 0) {
		// console.log("no keys in and");
		// must have at least 1 filter
		return false;
	}

	for (let x of and) {
		// console.log(x);
		if (!validFilter(x)) {
			// console.log("one of and keys not valid");
			return false;
		}
	}
	return true;
}

function checkOR(filter: any): boolean {
	let or: any[] = filter["OR"]; // or is an array of objects, not an object??

	let orKeys: any[] = Object.keys(or); // dont use object.keys on an array

	if (!(Array.isArray(or))){
		// console.log("or keys isn't an array");
		return false;
	}

	if (orKeys.length === 0) {
		// console.log("no keys in or");
		// must have at least 1 filter
		return false;
	}

	for (let x of or) {
		if (!validFilter(x)) {
			// console.log("one of or keys not valid");
			return false;
		}
	}
	return true;
}

function checkGT(filter: any): boolean {
	// console.log("got to GT function");
	let gt: any = filter["GT"];
	let gtKeys: any[] = Object.keys(gt);

	if (!(typeof gt === "object")) {
		// console.log("gt is not an object");
		return false;
	}

	let mKeys: any[] = Object.keys(gt); // idstring '_' mfield
	if (mKeys.length !== 1) {
		// console.log("gt has more than one mkey");
		return false;
	}

	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyDataset: string = mKeyArray[0];
	// TODO check that not more than 1 dataset is being referenced??? how
	let mKeyMField: string = mKeyArray[1];
	if (!((mKeyMField === "avg") ||
		(mKeyMField === "pass") ||
		(mKeyMField === "fail")  ||
		(mKeyMField === "audit") ||
		(mKeyMField === "year"))) {
		// console.log("mField not one of expected");
		return false;
	}

	let inputNum: any = gt[mKey];

	if (typeof inputNum !== "number") {
		// console.log("inputNum is not a number ");
		return false;
	}
	return true;
}

function checkLT(filter: any): boolean {
	// console.log("got to LT function");
	let gt: any = filter["LT"];
	let gtKeys: any[] = Object.keys(gt);

	if (!(typeof gt === "object")) {
		// console.log("gt is not an object");
		return false;
	}

	let mKeys: any[] = Object.keys(gt); // idstring '_' mfield

	// console.log(mKeys.length);
	if (mKeys.length !== 1) {
		// console.log("gt has more than one mkey");
		return false;
	}

	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyDataset: string = mKeyArray[0];
	// TODO check that not more than 1 dataset is being referenced??? how
	let mKeyMField: string = mKeyArray[1];
	if (!((mKeyMField === "avg") ||
		(mKeyMField === "pass") ||
		(mKeyMField === "fail")  ||
		(mKeyMField === "audit") ||
		(mKeyMField === "year"))) {
		// console.log("mField not one of expected");
		return false;
	}

	let inputNum: any = gt[mKey];

	if (typeof inputNum !== "number") {
		// console.log("inputNum is not a number ");
		return false;
	}
	return true;
}

function checkEQ(filter: any): boolean {
	// console.log("got to EQ function");
	let gt: any = filter["EQ"];
	let gtKeys: any[] = Object.keys(gt);

	if (!(typeof gt === "object")) {
		// console.log("gt is not an object");
		return false;
	}

	let mKeys: any[] = Object.keys(gt); // idstring '_' mfield

	// console.log(mKeys.length);
	if (mKeys.length !== 1) {
		// console.log("gt has more than one mkey");
		return false;
	}

	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyDataset: string = mKeyArray[0];
	// TODO check that not more than 1 dataset is being referenced??? how
	let mKeyMField: string = mKeyArray[1];
	if (!((mKeyMField === "avg") ||
		(mKeyMField === "pass") ||
		(mKeyMField === "fail")  ||
		(mKeyMField === "audit") ||
		(mKeyMField === "year"))) {
		// console.log("mField not one of expected");
		return false;
	}

	let inputNum: any = gt[mKey];

	if (typeof inputNum !== "number") {
		// console.log("inputNum is not a number ");
		return false;
	}

	// console.log("leaving EQ function");
	return true;
}

export {validWhere};
