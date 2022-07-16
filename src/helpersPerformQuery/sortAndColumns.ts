import {Section} from "../helpersAddDataset/convertToModel";
import {InsightResult} from "../controller/IInsightFacade";

function sortSections(order: any, addedSections: Section[]) {
	// order is a string
	let keyString: string[] = order.split("_");
	let field: string = keyString[1];

	// https://stackoverflow.com/questions/43311121/sort-an-array-of-objects-in-typescript

	if (field === "avg") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_avg < b.courses_avg) ? -1 : 1);
		return sortedSections;
	} else if (field === "pass") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_pass < b.courses_pass) ? -1 : 1);
		return sortedSections;
	} else if (field === "fail") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_fail < b.courses_fail) ? -1 : 1);
		return sortedSections;
	} else if (field === "audit") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_audit < b.courses_audit) ? -1 : 1);
		return sortedSections;
	} else if (field === "year") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_year < b.courses_year) ? -1 : 1);
		return sortedSections;
	} else if (field === "dept") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_dept < b.courses_dept) ? -1 : 1);
		return sortedSections;
	} else if (field === "id") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_id < b.courses_id) ? -1 : 1);
		return sortedSections;
	} else if (field === "instructor") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_instructor < b.courses_instructor) ? -1 : 1);
		return sortedSections;
	} else if (field === "title") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_title < b.courses_title) ? -1 : 1);
		return sortedSections;
	} else if (field === "uuid") {
		let sortedSections = addedSections.sort((a, b) =>
			(a.courses_uuid < b.courses_uuid) ? -1 : 1);
		return sortedSections;
	} else {
		// can't be??
		return addedSections;
	}
}

function getColumns(columns: any[], sortedSections: Section[]) {
	let results: InsightResult[] = []; // thing to return, add stuff to it
	for (let section of sortedSections) {
		let insightResult: InsightResult = {}; // is this how to instantiate empty map?

		for (let key of columns) {
			let keyString: string[] = key.split("_");
			// console.log(keyString);
			let datasetName: string = keyString[0];
			// console.log(datasetName);
			let field: string = keyString[1];

			if (field === "avg") {
				insightResult[key] = section.courses_avg;
			} else if (field === "pass") {
				insightResult[key] = section.courses_pass;
			} else if (field === "fail") {
				insightResult[key] = section.courses_fail;
			} else if (field === "audit") {
				insightResult[key] = section.courses_audit;
			} else if (field === "year") {
				insightResult[key] = section.courses_year;
			} else if (field === "dept") {
				insightResult[key] = section.courses_dept;
			} else if (field === "id") {
				insightResult[key] = section.courses_id;
			} else if (field === "instructor") {
				insightResult[key] = section.courses_instructor;
			} else if (field === "title") {
				insightResult[key] = section.courses_title;
			} else if (field === "uuid") {
				insightResult[key] = section.courses_uuid;
			} else {
				// cant rlly be since we've validated alr
			}
		}
		results.push(insightResult);
	}

	// pull from addedSections and put into results in correct format in same order and return
	// console.log(results.length);
	return results;
}

export {sortSections, getColumns};
