import {IConfigurationFile} from "../types";
import { promises as fsPromises } from 'fs';
import * as fs from "fs";

export async function readConfigurationFile(deployLocation?: string) : Promise<IConfigurationFile | undefined> {
    try {
        if (await fsPromises.stat(deployLocation + "/hosti.json")) {
            let file = await fsPromises.readFile(deployLocation + "/hosti.json", {encoding: "utf8"});
            return JSON.parse(file) as IConfigurationFile;
        }
        return undefined;
    }
    catch (e) {
        return undefined;
    }
}

export async function writeConfigurationFile(deployLocation?: string, config?: IConfigurationFile) : Promise<void> {
    await fsPromises.writeFile(deployLocation + "/hosti.json",  JSON.stringify(config, null, 4), { encoding: "utf8" });
}
