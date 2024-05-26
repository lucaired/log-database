import { describe, expect, test } from '@jest/globals';
import { IndexedLog } from './indexedLog';

describe('IndexedLog Simple', () => {
    test('IndexedLog read simple', () => {
        const log = new IndexedLog();
        log.write("key1", "value1");
        // 4 + 1 + 6 + 1 = 12
        expect(log.read("key1")?.value).toBe("value1");
    });
    test('IndexedLog multiple entries', () => {
        const log = new IndexedLog();
        log.write("key1", "value1");
        log.write("key1", "value2");
        log.write("key1", "value3");
        log.write("key1", "value4");
        log.write("key1", "value5");
        expect(log.read("key1")?.value).toBe("value5");
    });
    test('IndexedLog dump returns only the most recent records', () => {
        const log = new IndexedLog();
        log.write("key1", "value1");
        log.write("key1", "value2");
        log.write("key1", "value3");
        log.write("key1", "value4");
        log.write("key1", "value5");
        log.write("key2", "value1");
        expect(log.dumpIndexLog().length).toBe(2);
    });
});