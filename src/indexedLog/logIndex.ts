import { LogRecord } from "../log/logRecord";

interface LogIndexEntry {
    start: number;
    length: number;
}

export class LogIndex {
    private index: Map<string, string>;
    constructor() {
        this.index = new Map();
    }

    write(key: LogRecord['key'], start: number, length: number) {
        this.index.set(key, `${start},${length}`);
    }

    read(key: LogRecord['key']): LogIndexEntry | undefined {
        const entry = this.index.get(key);
        if (entry === undefined) {
            return undefined;
        } else {
            const [start, length] = entry.split(',').map(Number);
            return {
                start,
                length
            }
        }
    }
}