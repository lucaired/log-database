
/** The `Log` datastructure offers is an append-only
 * datastructure, containing a sequence of the `LogRecord`
 * key-value pairs.
 * Writes are always appended to the end of the internal
 * string, representing the log and reads will yield the
 * last version. */

import { LogRecord } from "./logRecord";

export class Log {
    private log: string;
    constructor() {
        this.log = "";
    }

    dump() {
        return this.log;
    }

    get length() {
        return this.log.length;
    }

    write(key: LogRecord['key'], value: LogRecord['value']) {
        this.log += new LogRecord(key, value).toString() + ";";
    }

    /**
     * We will read from a long string of the following format:
     * key1:value1;key2:value2;key3:value3
     * @param key 
     * @returns 
     */
    read(key: LogRecord['key']): LogRecord | undefined {
        let value: string | undefined = undefined;
        let keyFound = false;
        let currentKey = "";
        for (let char of this.log) {
            if (char === ":") {
                keyFound = true;
                if (currentKey === key) {
                    value = "";
                }
                continue;
            }
            if (char === ';') {
                keyFound = false;
                currentKey = "";
                continue;
            }
            if (keyFound) {
                if (currentKey === key) {
                    value += char;
                }
                continue;
            } else {
                currentKey += char;
            }
        }
        return value && value !== "" ? new LogRecord(key, value) : undefined;
    }
}