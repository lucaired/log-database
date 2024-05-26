import { describe, expect, test } from '@jest/globals';
import { SegmentedLog } from './segmentedLog';

describe('segmentLog', () => {
    const segmentedLog = new SegmentedLog();

    test('should read from the most recent IndexedLog', () => {
        const hundredA = 'a'.repeat(90);
        segmentedLog.write('key1', hundredA);
        const hundredB = 'b'.repeat(90);
        segmentedLog.write('key2', hundredB);
        expect(segmentedLog.read('key2')?.value).toBe(hundredB);
        expect(segmentedLog.info().indexedLog.length).toBe(2);
    });

    test('should throw an error if the key and value are too large', () => {
        const hundredA = 'a'.repeat(100); // will yield 106 characters
        expect(() => segmentedLog.write('key3', hundredA)).toThrowError('Key and value too large');
    });
});