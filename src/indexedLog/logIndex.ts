import { LogRecord } from "../log/logRecord";

export class LogIndex {
    private index: Map<string, number>;
    constructor() {
        this.index = new Map();
    }

    write(key: LogRecord['key'], value: number) {
        this.index.set(key, value);
    }

    read(key: LogRecord['key']): number | undefined {
        return this.index.get(key);
    }
}