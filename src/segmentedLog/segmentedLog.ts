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
    private indexedLogs: IndexedLog[] = [];
    private sizeLimit: number;

    constructor(sizeLimit: number = 100) {
        this.sizeLimit = sizeLimit;
    }

    info() {
        return {
            indexedLogSize: this.indexedLogs.length,
            sizeLimit: this.sizeLimit
        };
    }

    write(key: string, value: string) {
        this.writeToIndexedLogs(this.indexedLogs, key, value);
    }

    read(key: string): LogRecord | undefined {
        for (let i = this.indexedLogs.length - 1; i >= 0; i--) {
            const record = this.indexedLogs[i].read(key);
            if (record) return record;
        }
        return undefined;
    }

    private writeToIndexedLogs(indexedLogs: IndexedLog[], key: string, value: string) {
        const newRecordLength = key.length + value.length + 2;
        if (newRecordLength > this.sizeLimit) throw new Error("Key and value too large");
        if (indexedLogs.length === 0) {
            indexedLogs.push(new IndexedLog());
        }
        const lastLog = indexedLogs[indexedLogs.length - 1];
        if (lastLog.length + newRecordLength > this.sizeLimit) {
            indexedLogs.push(new IndexedLog());
        }
        indexedLogs[indexedLogs.length - 1].write(key, value);
    }

    /**
     * This methods goes through all the `IndexedLog`s and removes outdated records.
     * First for each `IndexedLog` it gets all the keys and then it reads the records
     * by using one of its internal methods, yielding only the most-recent records per
     * `IndexedLog`. All such records are written to an temporal HashMap, starting with
     * the records from the oldest `IndexedLog`, then the next oldest and so on. This
     * will retain only the most-recent records. Upon completion of this process, the
     * remaining records are written back to the `IndexedLog`s.
     */
    compact() {
        const tempMap = new Map<string, LogRecord>();
        this.indexedLogs.reduce((acc, indexedLog) => {
            indexedLog.dumpIndexLog().forEach(record => {
                acc.set(record.key, record);
            });
            return acc;
        }, tempMap);
        const compactedIndexedLogs: IndexedLog[] = Array.from(tempMap.values()).reduce((acc, record) => {
            this.writeToIndexedLogs(acc, record.key, record.value);
            return acc;
        }, []);
        this.indexedLogs = compactedIndexedLogs;
    }
}