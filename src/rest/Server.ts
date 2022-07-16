import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import InsightFacade from "../controller/InsightFacade";
import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError
} from "../controller/IInsightFacade";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;

	private static facade: IInsightFacade;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();

		this.registerMiddleware();
		this.registerRoutes();

		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		this.express.use(express.static("./frontend/public"));

		Server.facade = new InsightFacade();
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		// enable cors in request headers to allow cross-origin HTTP requests
		this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// This is an example endpoint this you can invoke by accessing this URL in your browser:
		// http://localhost:4321/echo/hello
		this.express.get("/echo/:msg", Server.echo);
		this.express.put("/dataset/:id/:kind", Server.addDataset);

		this.express.post("/query", Server.getResults);
		this.express.delete("/dataset/:id", Server.removeDataset);
		this.express.get("/datasets", Server.displayDatasets);

	}

	private static async addDataset(req: Request, res: Response) {
		try {
			const content = Buffer.from(req.body).toString("base64");
			let kind = Server.addDatasetHelper(req.params.kind);

			const response = await Server.performAddDataset(req.params.id, content, kind);
			console.log(response);
			res.status(200).json({result: response});
		} catch (err: any) {
			console.log(err);
			res.status(400).json({error:err.message});
		}
	}

	private static performAddDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		// add the chosen dataset here

		return Server.facade.addDataset(id, content, kind).then((ids) => {
			return ids;
		});
	}

	private static async displayDatasets(req: Request, res: Response) {
		const response = await Server.performDisplayDatasets();
		console.log(response);
		res.status(200).json({result: response});
		// there is no specified error that can be thrown with the GET
	}

	private static performDisplayDatasets(): Promise<InsightDataset[]> {
		return Server.facade.listDatasets().then((datasets) => {
			return datasets;
		});
	}

	private static async removeDataset(req: Request, res: Response) {
		try {
			const response = await Server.performRemoveDataset(req.params.id);
			console.log(response);
			res.status(200).json({result: response});
		} catch (err) {
			if (err instanceof InsightError) {
				res.status(400).json({error:err.message});
			} else if (err instanceof NotFoundError) {
				res.status(404).json({error:err.message});
			}
		}
	}

	private static performRemoveDataset(id: string): Promise<string> {
		return Server.facade.removeDataset(id).then((idOfRemoved) => {
			return idOfRemoved;
		});
	}

	private static async getResults(req: Request, res: Response) {
		try {
			// console.log("GOT TO FUNCTION");
			// console.log(req.body);
			// console.log(typeof req.body);
			const input = JSON.stringify(req.body); // not sure if we need
			const input2 = JSON.parse(input); // not sure if we need
			// console.log(input2);
			const response = await Server.performGetResults(input2);
			// console.log(response);
			res.status(200).json({result: response});
		} catch (err: any) {
			res.status(400).json({error:err.message});
		}
	}

	private static performGetResults(query: any): Promise<InsightResult[]> {

		return Server.facade.performQuery(query).then((results) => {
			// console.log(results);
			return results;
		});
	}

	// The next two methods handle the echo service.
	// These are almost certainly not the best place to put these, but are here for your reference.
	// By updating the Server.echo function pointer above, these methods can be easily moved.
	private static echo(req: Request, res: Response) {
		try {
			console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = Server.performEcho(req.params.msg);
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: err});
		}
	}

	private static performEcho(msg: string): string {
		if (typeof msg !== "undefined" && msg !== null) {
			return `${msg}...${msg}`;
		} else {
			return "Message not provided";
		}
	}

	private static addDatasetHelper(datasetKind: any) {
		if (datasetKind === "courses") {
			return InsightDatasetKind.Courses;
		} else if (datasetKind === "rooms") {
			return InsightDatasetKind.Rooms;
		} else {
			throw new Error("Invalid Kind");
		}
	}
}
