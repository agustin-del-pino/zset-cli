import { Parser, ZSObjectType, ZSetEngine, node } from "zset-lang";
import * as readline from "node:readline/promises";
import * as fs from "node:fs/promises";
import paper from "./paper";
import help from "./help";

class CLI {
    private readonly versionNumber: string;
    private readonly zse: ZSetEngine;
    private readonly parser: Parser;

    private readonly commands = new Set(["help", "version", "repl", "run"]);

    constructor(version: string) {
        this.versionNumber = version;
        this.zse = new ZSetEngine();
        this.parser = new Parser();
    }

    public async version(): Promise<string> {
        return this.versionNumber;
    }

    public async help(args: string[]): Promise<string> {
        if (this.commands.has(args[0])) {
            return help[args[0]];
        }
        return help.commands;
    }

    public async repl(): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(`ZSet-Lang ${this.versionNumber} REPL\n`)

        while (true) {
            const line = await rl.question(">> ");
            if (line === "exit") {
                break;
            }
            if (line === "clear") {
                console.clear();
                continue;
            }

            try {
                const ret = this.zse.eval(line);
                if (ret.type !== ZSObjectType.NULL) {
                    console.log(ret.toString());
                }
            } catch (e) {
                console.error((e as Error).message);
            }
        }
        rl.close();
        return "";
    }

    public async paper(args: string[]): Promise<string> {
        const out = this.getFlag(args,
            ["--out", "-o"],
            `${args[0].replace(".zs", ".md")}`);

        if (out === "") {
            throw new Error("missing --out flag value");
        }

        const src = await fs.readFile(`${args[0]}`, 'utf8');
        let source: node;

        try {
            source = this.parser.parse(src);
        } catch (e) {
            throw new Error(`the ${args[0]} could not be converted due: \n${(e as Error).message}`);
        }

        await fs.writeFile(out, paper(source));

        return "";
    }


    private getFlag(args: string[], flags: string[], def: string): string {
        for (let i = 0; i < args.length; i++) {
            if (flags.includes(args[i])) {
                return args[i + 1] || "";
            }
        }
        return def
    }

    async run(args: string[]): Promise<string> {
        if (args.length === 0) {
            throw new Error("missing file to run");
        }

        const src = await fs.readFile(`${args[0]}`, 'utf8')
        this.zse.exec(src);
        return "";
    }

    public async execute(cmd: string, args: string[]): Promise<string> {
        if (cmd === "") {
            throw new Error(`missing command`);
        }

        if (!this.commands.has(cmd)) {
            throw new Error(`the ${cmd} command is invalid`);
        }

        return await this[cmd](args);
    }
}
export default CLI;