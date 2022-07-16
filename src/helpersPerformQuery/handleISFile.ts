import {Section} from "../helpersAddDataset/convertToModel";

function handleIS(is: any, section: Section) {
	let sKeys: any[] = Object.keys(is); // idstring '_' sfield

	let sKey = sKeys[0]; // idstring '_' sfield
	let sKeyArray: string[] = sKey.split("_");
	let sKeySField: string = sKeyArray[1]; // sfield
	let inputString: any = is[sKey]; // thing to compare with

	// todo check if inputstring has asterix
	if ((inputString.charAt(0) === "*") && (inputString.charAt(inputString.length - 1) === "*")) {
		if (atBoth(inputString, sKeySField, section)) {
			return true;
		} else {
			return false;
		}
	} else if (inputString.charAt(inputString.length - 1) === "*") {
		if (atEnd(inputString, sKeySField, section)) {
			return true;
		} else {
			return false;
		}
	} else if (inputString.charAt(0) === "*") {
		if (atFront(inputString, sKeySField, section)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (none(inputString, sKeySField, section)) {
			return true;
		} else {
			return false;
		}
	}
}

function atBoth(inputString: string, sKeySField: string, section: Section) {
	let input = inputString.slice(1, inputString.length - 1);
	// console.log(input);
	if (sKeySField === "dept") {
		if (section.courses_dept.includes(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "id") {
		if (section.courses_id.includes(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "instructor") {
		if (section.courses_instructor.includes(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "title") {
		if (section.courses_title.includes(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "uuid") {
		if (section.courses_uuid.includes(input)) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

function none(inputString: string, sKeySField: string, section: Section) {
	if (sKeySField === "dept") {
		if (section.courses_dept === inputString) { // todo how to check ebfn????
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "id") {
		if (section.courses_id === inputString) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "instructor") {
		if (section.courses_instructor === inputString) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "title") {
		if (section.courses_title === inputString) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "uuid") {
		if (section.courses_uuid === inputString) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

function atFront(inputString: string, sKeySField: string, section: Section) {
	// * at front, string must end with input
	let input = inputString.slice(1);
	// console.log(input);
	if (sKeySField === "dept") {
		if (section.courses_dept.endsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "id") {
		if (section.courses_id.endsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "instructor") {
		if (section.courses_instructor.endsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "title") {
		if (section.courses_title.endsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "uuid") {
		if (section.courses_uuid.endsWith(input)) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

function atEnd(inputString: string, sKeySField: string, section: Section) {
	// * at end, string must start with input
	let input = inputString.slice(0, inputString.length - 1);
	// console.log(input);
	if (sKeySField === "dept") {
		if (section.courses_dept.startsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "id") {
		if (section.courses_id.startsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "instructor") {
		if (section.courses_instructor.startsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "title") {
		if (section.courses_title.startsWith(input)) {
			return true;
		} else {
			return false;
		}
	} else if (sKeySField === "uuid") {
		if (section.courses_uuid.startsWith(input)) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

export {handleIS};
