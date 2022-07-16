import * as fs from "fs-extra";

const persistDir = "./data";

const getContentFromArchives = (name: string): string =>
	fs.readFileSync(`test/resources/archives/${name}`).toString("base64");

const clearDisk = () => fs.removeSync(persistDir);

export {getContentFromArchives, persistDir, clearDisk};
