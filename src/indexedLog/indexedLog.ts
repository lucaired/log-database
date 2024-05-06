import { LogIndex } from "./logIndex";
import { Log } from "../log";
import { LogRecord } from "../log/logRecord";

export class IndexLog extends Log {
    private index: LogIndex;
    constructor() {
        super();
        this.index = new LogIndex();
    }

    write(key: LogRecord['key'], value: LogRecord['value']) {
        this.index.write(key, this.length);
        super.write(key, value);
    }

    /** TODO: implement index access read */
}