import path = require("node:path");
import CLI from "./cli";
import * as fs from "node:fs";

const version = "1.0.0";

(async () => {
    const args = process.argv.slice(2);
    
    const cli = new CLI(version);
    try {
        const ret = await cli.execute(args[0], args.slice(1));
        console.log(ret);
    } catch (e) {
        console.error((e as Error).message);
    }
})()
