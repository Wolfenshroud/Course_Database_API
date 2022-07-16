import JSZip from "jszip";
import {InsightDatasetKind, InsightError} from "../controller/IInsightFacade";

// Object that represents the internal data model for Datasets of type courses
// that are deemed valid and written to the disk
export class InternalModel {

	public datasets: Map<string, Dataset>;

	constructor() {
		this.datasets = new Map();
	}

	public async addToInternalModel(validated: JSZip, dataset_id: string) {
		let ds: Dataset = new Dataset();
		const promises: any[] = [];

		promises.push(validated.folder("courses")?.forEach((relativePath, file) => {
			// console.log("iterating over", relativePath);
			let obj;

			promises.push(file.async("string").then((ret) => {

				try {

					obj = JSON.parse(ret);

					for (let i of obj.result) {

						if ("Subject" in i && "Course" in i && "Avg" in i && "Professor" in i && "Title" in i &&
							"Pass" in i && "Fail" in i && "Audit" in i && "id" in i && "Section" in i && "Year" in i) {

							ds.courses.push(this.addFields(i));
						} else {
							return;
						}
					}

				} catch (err) {
					return;
				}
			}));

		}));

		await Promise.all(promises).then(() => {
			if (ds.courses.length === 0) {
				return Promise.reject(new InsightError());
			} else {
				ds.dataset_ID = dataset_id;
				ds.dataset_numRows = ds.courses.length;
				this.datasets.set(dataset_id, ds);
			}
		});
	}

	private addFields (obj: any) {
		let sec: Section = new Section();

		sec.courses_dept = obj.Subject;
		sec.courses_id = obj.Course;
		sec.courses_avg = obj.Avg;
		sec.courses_instructor = obj.Professor;
		sec.courses_title = obj.Title;
		sec.courses_pass = obj.Pass;
		sec.courses_fail = obj.Fail;
		sec.courses_audit = obj.Audit;
		sec.courses_uuid = obj.id;
		if (obj.Section === "overall") {
			sec.courses_year = 1900;
		} else {
			sec.courses_year = obj.Year;
		}

		return sec;
	}
}

export class Dataset {

	public dataset_ID: string;
	public dataset_kind: InsightDatasetKind;
	public dataset_numRows: number;
	public courses: Section[];

	constructor() {
		this.dataset_ID = "";
		this.dataset_kind = InsightDatasetKind.Courses;
		this.dataset_numRows = 0;
		this.courses = [];
	}
}

export class Section {

	public courses_dept: string;
	public courses_id: string;
	public courses_avg: number;
	public courses_instructor: string;
	public courses_title: string;
	public courses_pass: number;
	public courses_fail: number;
	public courses_audit: number;
	public courses_uuid: string;
	public courses_year: number;

	constructor() {
		this.courses_dept = "";
		this.courses_id = "";
		this.courses_avg = 0;
		this.courses_instructor = "";
		this.courses_title = "";
		this.courses_pass = 0;
		this.courses_fail = 0;
		this.courses_audit = 0;
		this.courses_uuid = "";
		this.courses_year = 0;
	}
}
