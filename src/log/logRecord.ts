export class LogRecord {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        if (!key || key.length === 0) throw new Error("Key must not be empty");
        if (!value || value.length === 0) throw new Error("Value must not be empty");
        this.key = key;
        this.value = value;
    }

    toString() {
        return `${this.key}:${this.value}`;
    }

    static fromString(str: string): undefined | LogRecord {
        const withoutSemicolon = str.slice(0, -1);
        const [key, value] = withoutSemicolon.split(":");
        if (!key || !value) return undefined;
        return new LogRecord(key, value);
    }
}