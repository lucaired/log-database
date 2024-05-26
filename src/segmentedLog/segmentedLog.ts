/**
 * This datastructure aims a reducing the memory impact of the log-structure by removing
 * outdated (overriden) records from the log-structure. Furthermore, it limits the size of
 * the log-structure to allow us to keep it always in memory.
 * 
 * - size limit for log-structure
 * - datastructure to manage multiple `IndexedLog`s
 * - lookup routine that checks for a key, starting from the most recent `IndexedLog`
 * - compaction routine that removes outdated records from the log-structure by going through
*    an index log and removing the outdated records which have a newer version in the log-structure.
 */

import { IndexedLog } from "../indexedLog";
import { LogRecord } from "../log";

export class SegmentedLog {
    private indexedLog: IndexedLog[] = [];
    private sizeLimit: number;

    constructor(sizeLimit: number = 100) {
        this.sizeLimit = sizeLimit;
    }

    info() {
        return {
            indexedLog: this.indexedLog,
            sizeLimit: this.sizeLimit
        };
    }

    write(key: string, value: string) {
        const newRecordLength = key.length + value.length + 2;
        if (newRecordLength > this.sizeLimit) throw new Error("Key and value too large");
        if (this.indexedLog.length === 0) {
            this.indexedLog.push(new IndexedLog());
        }
        const lastLog = this.indexedLog[this.indexedLog.length - 1];
        if (lastLog.length + newRecordLength > this.sizeLimit) {
            this.indexedLog.push(new IndexedLog());
        }
        this.indexedLog[this.indexedLog.length - 1].write(key, value);
    }

    read(key: string): LogRecord | undefined {
        for (let i = this.indexedLog.length - 1; i >= 0; i--) {
            const record = this.indexedLog[i].read(key);
            if (record) return record;
        }
        return undefined;
    }
}