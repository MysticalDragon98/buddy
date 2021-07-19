import { join } from "path";

const fs = require("fs/promises");
const fss = require("fs");

export class FileSystem {

    static async read (path: string) {
        return await fs.readFile(path, 'utf-8');
    }

    static async write (path: string, data: string) {
        return await fs.writeFile(path, data);
    }

    static readSync (path: string) {
        return fss.readFileSync(path, 'utf-8');
    }

    static writeSync (path: string, data: string) {
        return fss.writeFileSync(path, data);
    }

    static async lookup (dirs: string[], name: string) {
        const filesFound = await Promise.all(dirs.map(async (dir) => {
            try {
                const data = await FileSystem.read(join(dir, name));

                return data;
            } catch (exc) {
                if (exc.code !== "ENOENT") throw exc;

                return null;
            }
        }));
        
        return filesFound.find(f => !!f) || null;
    }
}