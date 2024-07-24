export default class StringBuilder {
    private readonly buffer: string[] = [];
    private lines: number = 0;

    public write(s: string): StringBuilder {
        if (this.buffer[this.lines] === undefined) {
            this.buffer.push("");
        }
        this.buffer[this.lines] += s;
        return this;
    }

    public line(s: string): StringBuilder {
        this.buffer.push(s);
        this.lines++;
        return this;
    }

    public end(): StringBuilder {
        return this.line("");
    }

    public newline(): StringBuilder {
        return this.line("");
    }

    public input(fn: (b: StringBuilder, ...args: any[]) => void, ...args: any[]): StringBuilder {
        fn(this, ...args);
        return this;
    }

    public toString(): string {
        return this.buffer.join("\n");
    }
}