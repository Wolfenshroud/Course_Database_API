import {InsightDatasetKind} from "../controller/IInsightFacade";
import JSZip from "jszip";
// Object that represents the internal data model for Datasets of type courses
// that are deemed valid and written to the disk
export class InternalModelRooms {
	public datasetsR: Map<string, DatasetR>;

	constructor() {
		this.datasetsR = new Map();
	}

	public async addToInternalModelR (validated: JSZip, dataset_id: string) {
		let dsR: DatasetR = new DatasetR();


	}

	private getGeoLoc (address: string) {
		//
	}
}

export class DatasetR {
	public dataset_ID: string;
	public dataset_kind: InsightDatasetKind;
	public dataset_numRows: number;
	public rooms: Room[];

	constructor() {
		this.dataset_ID = "";
		this.dataset_kind = InsightDatasetKind.Rooms;
		this.dataset_numRows = 0;
		this.rooms = [];
	}
}

export class Room {

	public rooms_fullname: string;
	public rooms_shortname: string;
	public rooms_number: string;
	public rooms_name: string;
	public rooms_address: string;
	public rooms_lat: number;
	public rooms_lon: number;
	public rooms_seats: number;
	public rooms_type: string;
	public rooms_furniture: string;
	public rooms_href: string;

	constructor() {
		this.rooms_fullname = "";
		this.rooms_shortname = "";
		this.rooms_number = "";
		this.rooms_name = "";
		this.rooms_address = "";
		this.rooms_lat = 0;
		this.rooms_lon = 0;
		this.rooms_seats = 0;
		this.rooms_type = "";
		this.rooms_furniture = "";
		this.rooms_href = "";
	}
}
