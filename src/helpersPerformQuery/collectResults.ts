import {Dataset, Section} from "../helpersAddDataset/convertToModel";

import {sortSections, getColumns} from "./sortAndColumns";
import {handleIS} from "./handleISFile";

const collectResults = (query: any, dataset: Dataset) => {

	let addedSections: Section[];
	// console.log("one");

	const coursesArray = dataset.courses; // courses is an array of sections
	// console.log("two");

	let where: any = query["WHERE"];
	// console.log("This is the courses array size:");
	// console.log(coursesArray.length);

	let whereKeys: any[] = Object.keys(where);
	// console.log(whereKeys);
	if (whereKeys.length === 0) {
		addedSections = coursesArray;
	} else {
		addedSections = addSections(where, coursesArray);
	}
	// console.log("SIZE OF ADDEDSECTIONS IS " + addedSections.length);

	let options: any = query["OPTIONS"];

	let columns: any[] = options["COLUMNS"];

	let optionsKeys: any[] = Object.keys(options);
	// console.log(optionsKeys);

	let sortedSections;

	if (optionsKeys.length === 2) {
		// console.log("got to 2");
		let order: any = options["ORDER"];
		sortedSections = sortSections(order, addedSections); // done
	} else {
		// console.log("got to 1");
		sortedSections = addedSections;
	}


	return Promise.resolve(getColumns(columns, sortedSections)); // will return an array of insight results
};

function addSections (where: any, coursesArray: Section[]): Section[] {
	let addedSections: Section[] = [];
	// let num = 0;
	for (let section of coursesArray) {
		// num++;
		// console.log(num);
		if (handleFilter(where, section)) {
			addedSections.push(section);
			// console.log(addedSections.length);
		}
	}
	return addedSections;
}

function handleFilter(filter: any, section: Section) {
	let filterKeys: any[] = Object.keys(filter);
	if (filterKeys[0] === "IS") {
		let is: any = filter["IS"];
		if (handleIS(is, section)) {
			return true;
		}
	} else if (filterKeys[0] === "NOT") {
		let not: any = filter["NOT"];
		if (handleNOT(not, section)) {
			return true;
		}
	} else if (filterKeys[0] === "AND") {
		let and: any = filter["AND"];
		if (handleAND(and, section)) {
			return true;
		}
	} else if (filterKeys[0] === "OR") {
		let or: any = filter["OR"];
		if (handleOR(or, section)) {
			return true;
		}
	} else if (filterKeys[0] === "GT") {
		let gt: any = filter["GT"];
		if (handleGT(gt, section)) {
			return true;
		}
	} else if (filterKeys[0] === "LT") {
		let lt: any = filter["LT"];
		if (handleLT(lt, section)) {
			return true;
		}
	} else if (filterKeys[0] === "EQ") {
		let eq: any = filter["EQ"];
		if (handleEQ(eq, section)) {
			return true;
		}
	} else {
		return false;
	}
	return false;
}

function handleNOT(not: any, section: Section) {

	if (!handleFilter(not, section)) { // todo fio if send in not, or it's key
		return true;
	}

	return false;
}

function handleAND(and: any, section: Section) {
	for (let x of and) {
		// console.log(x);
		if (!handleFilter(x, section)) {
			// console.log("one of and conditions not true, so returning false");
			return false;
		}
	}
	return true;
}

function handleOR(or: any, section: Section) {
	for (let x of or) {
		// console.log(x);
		if (handleFilter(x, section)) {
			// console.log("one of or conditions not true, so returning false");
			return true;
		}
	}
	return false;
}

function handleGT(gt: any, section: Section) {
	let mKeys: any[] = Object.keys(gt); // idstring '_' mfield
	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyMField: string = mKeyArray[1]; // mfield
	let inputNum: any = gt[mKey];

	if (mKeyMField === "avg") {
		if (section.courses_avg > inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "pass") {
		if (section.courses_pass > inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "fail") {
		if (section.courses_fail > inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "audit") {
		if (section.courses_audit > inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "year") {
		if (section.courses_year > inputNum) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

function handleLT(lt: any, section: Section) {
	let mKeys: any[] = Object.keys(lt); // idstring '_' mfield
	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyMField: string = mKeyArray[1]; // mfield
	let inputNum: any = lt[mKey];

	if (mKeyMField === "avg") {
		if (section.courses_avg < inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "pass") {
		if (section.courses_pass < inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "fail") {
		if (section.courses_fail < inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "audit") {
		if (section.courses_audit < inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "year") {
		if (section.courses_year < inputNum) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

function handleEQ(eq: any, section: Section) {
	let mKeys: any[] = Object.keys(eq); // idstring '_' mfield
	let mKey = mKeys[0];
	let mKeyArray: string[] = mKey.split("_");
	let mKeyMField: string = mKeyArray[1]; // mfield
	let inputNum: any = eq[mKey];

	if (mKeyMField === "avg") {
		if (section.courses_avg === inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "pass") {
		if (section.courses_pass === inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "fail") {
		if (section.courses_fail === inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "audit") {
		if (section.courses_audit === inputNum) {
			return true;
		} else {
			return false;
		}
	} else if (mKeyMField === "year") {
		if (section.courses_year === inputNum) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

export {collectResults};
