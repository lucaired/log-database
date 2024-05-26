import { LogIndex } from "./logIndex";
import { Log } from "../log";
import { LogRecord } from "../log/logRecord";

/** The `IndexedLog` allows for faster access to a key-value record by storing
 * exact locations of the record in the log. This is done by storing the index
 * of the record in a separate index log. By also storing the length of the record
 * in the index log, the record can be read directly from the log without having
 * to iterate through the log.
*/

export class IndexedLog extends Log {
    private index: LogIndex;
    constructor() {
        super();
        this.index = new LogIndex();
    }

    /**
     * The `Log` contains a sequence of `LogRecord`s in the following form:
     * `<key1>:<record1>;...<keyn>:<recordn>` and we'll store the
     * start position and the length of the `LogRecord` in `LogIndex`
     * datastructure. 
     * 
     * For any give new `LogRecord` the starting position is the length
     * of the current `Log`.
     * @param key 
     * @param value 
     */

    write(key: LogRecord['key'], value: LogRecord['value']) {
        const logRecord = new LogRecord(key, value);
        this.index.write(key, this.length, logRecord.toString().length);
        super.write(key, value);
    }

    read(key: LogRecord['key']): LogRecord | undefined {
        // the entry can be undefined, we can only destructure if we are sure it's not undefined
        const { start, length } = this.index.read(key) ?? {};
        if (start === undefined || length === undefined) return undefined;
        const recordDump = this.dump();
        const maxLength = Math.min(recordDump.length, start + length + 1);
        const record = recordDump.slice(start, maxLength);
        return LogRecord.fromString(record);
    }

    /**
     * For compaction, we need to get all the keys from the log
     * and then return all the records from the log. This will
     * yield only the most-recent records, because the index is updated with
     * every write operation.
     */
    dumpIndexLog(): Array<LogRecord> {
        return this.index.keys.map(this.read.bind(this)).filter((record): record is LogRecord => record !== undefined);
    }
}   