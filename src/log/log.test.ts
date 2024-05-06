import { beforeEach, describe, expect, test } from '@jest/globals';
import { Log } from './log';

let log: Log;

describe('Log Simple', () => {
    test('Log read simple', () => {
        log = new Log();
        log.write("key1", "value1");
        expect(log.read("key1")?.value).toBe("value1");
    });
});

describe('Log', () => {
    beforeEach(() => {
        log = new Log();
        log.write("key1", "value1");
        log.write("key2", "value2");
        log.write("key3", "value3");
        log.write("key2", "value4");
    });

    test('Log dump', () => {
        expect(log.dump()).toBe("key1:value1;key2:value2;key3:value3;key2:value4;");
    });
    test('Log read', () => {
        expect(log.read("key1")?.value).toBe("value1");
        expect(log.read("key2")?.value).toBe("value4");
        expect(log.read("key3")?.value).toBe("value3");
    });
});