import { LogRecord } from "../log/logRecord";

interface LogIndexValue {
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

    read(key: LogRecord['key']): LogIndexValue | undefined {
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

    /**
     * This method is used for compaction. It returns all the records in the index.
     * Per definition, this will yield only the most-recent records, because the index
     * is updated with every write operation.
     * @returns 
     */
    get keys(): Array<LogRecord['key']> {
        return Array.from(this.index.keys());
    }
}