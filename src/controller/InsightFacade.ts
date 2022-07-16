import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError,
	ResultTooLargeError
} from "./IInsightFacade";
import JSZip from "jszip";
import {Dataset, InternalModel} from "../helpersAddDataset/convertToModel";
import * as fs from "fs-extra";

import {isQueryValid} from "../helpersPerformQuery/checkValidity";
import {collectResults} from "../helpersPerformQuery/collectResults";
import {InternalModelRooms} from "../helpersAddDataset/modelRooms";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	private internalModel: InternalModel;
	private internalModelR: InternalModelRooms;

	constructor() {
		// console.log("InsightFacadeImpl::init()");
		this.internalModel = new InternalModel();
		this.internalModelR = new InternalModelRooms();
	}

	// Helper function to check whether a datasetID is valid
	private isInvalidID (datasetID: string)  {
		return (datasetID.trim().length === 0 || datasetID.includes("_"));
	}

	// Helper function to check whether a dataset has already been added
	private async isAlreadyAdded (id: string) {
		if (fs.existsSync("./data/")) {
			await fs.readdir("./data/").then((files) => {
				if (files.includes(id)) {
					return Promise.reject(new InsightError("InsightError"));
				}
			});
		}
	}

	// Helper function to check whether a given zip file is valid and proper
	private async isZipValid (content: string, zip: JSZip) {
		try {
			await zip.loadAsync(content, {base64: true});
		} catch (err) {
			return Promise.reject(new InsightError("InsightError"));
		}
	}

	public async addDataset (id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		let zip = new JSZip();

		await this.isAlreadyAdded(id);

		await this.isZipValid(content, zip);

		let unzipped: JSZip = await zip.loadAsync(content, {base64: true});

		if (this.isInvalidID(id)) {
			return Promise.reject(new InsightError("InsightError"));

		} else if (kind === "courses") {

			await this.internalModel.addToInternalModel(unzipped, id);
			fs.outputJSONSync("./data/" + id, this.internalModel.datasets.get(id));

		} else {

			return Promise.reject(new InsightError("InsightError"));
		}

		return fs.readdir("./data/").then((files) => {
			return Promise.resolve(files);
		});
	}

	public removeDataset(id: string): Promise<string> {
		let removalPath = "./data/" + id;

		if (this.isInvalidID(id)) {
			return Promise.reject(new InsightError("InsightError"));
		}  else if (fs.existsSync(removalPath)) {
			fs.removeSync(removalPath);
		} else {
			return Promise.reject(new NotFoundError("NotFoundError"));
		}

		return Promise.resolve(id);
	}

	public async performQuery(query: unknown): Promise<InsightResult[]> {
		// console.log("got to perform query");

		// console.log(query);

		if (!(isQueryValid(query))) {
			// console.log("invalid query");
			// query format checker
			return Promise.reject(new InsightError("Invalid Query"));
		}

		// console.log("IS VALID QUERY ");

		let validQuery: any;
		if (typeof query === "object") {
			if (query !== null) {
				validQuery = query;
			} else {
				// console.log("query was null");
			}
		} else if (typeof query === "string") {
			validQuery = JSON.parse(query);
		} else {
			// console.log("Not a string");
		}

		let dSetName = this.getValidDatasetName(query); // get from column value
		// console.log(dSetName);

		try {
			const data: Dataset = await fs.readJSONSync("./data/" + dSetName);

			let toReturn: InsightResult[] = await collectResults(validQuery, data);

			// console.log(toReturn.length);

			if (toReturn.length > 5000) {
				return Promise.reject(new ResultTooLargeError("Invalid Query"));
			}

			// console.log(toReturn);

			return Promise.resolve(toReturn); // input is correct dataset and correct query
		} catch (e) {
			return Promise.reject(new InsightError("Dataset not added"));
		}
	}


	public getValidDatasetName(query: any): string {
		let options: any = query["OPTIONS"];
		let columns: any[] = options["COLUMNS"];
		let first: string = columns[0];
		let keyString: string[] = first.split("_");
		return keyString[0];
	}

	public async listDatasets(): Promise<InsightDataset[]> {
		let retArray: InsightDataset[] = [];

		if (fs.existsSync("./data/")) {
			let datasets = fs.readdirSync("./data/");
			for (let i of datasets) {
				let obj = fs.readJSONSync("./data/" + i);

				let insightD = {
					id: obj.dataset_ID,
					kind: obj.dataset_kind,
					numRows: obj.dataset_numRows,
				};

				retArray.push(insightD);
			}
		}

		return Promise.resolve(retArray);
	}
}
