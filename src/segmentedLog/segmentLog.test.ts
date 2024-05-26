import { describe, expect, test } from '@jest/globals';
import { SegmentedLog } from './segmentedLog';

describe('segmentLog', () => {

    test('should read from the most recent IndexedLog', () => {
        const segmentedLog = new SegmentedLog();
        const hundredA = 'a'.repeat(90);
        segmentedLog.write('key1', hundredA);
        const hundredB = 'b'.repeat(90);
        segmentedLog.write('key2', hundredB);
        expect(segmentedLog.read('key2')?.value).toBe(hundredB);
        expect(segmentedLog.info().indexedLogSize).toBe(2);
    });

    test('should throw an error if the key and value are too large', () => {
        const segmentedLog = new SegmentedLog();
        const hundredA = 'a'.repeat(100); // will yield 106 characters
        expect(() => segmentedLog.write('key3', hundredA)).toThrowError('Key and value too large');
    });

    test('should create a new IndexedLog if the size limit is reached', () => {
        const segmentedLog = new SegmentedLog(100);
        const hundredA = 'a'.repeat(90);
        segmentedLog.write('key4', hundredA);
        const hundredB = 'b'.repeat(90);
        segmentedLog.write('key5', hundredB);
        expect(segmentedLog.info().indexedLogSize).toBe(2);
    });

    test('should compact the log', () => {
        const segmentedLog = new SegmentedLog(20);
        const fourA = 'a'.repeat(4);
        segmentedLog.write('key1', fourA); // 10 size
        segmentedLog.write('key2', fourA); // 10 size
        segmentedLog.write('key3', fourA); // 10 size
        segmentedLog.write('key4', fourA); // 10 size
        expect(segmentedLog.info().indexedLogSize).toBe(2);
        const fourB = 'b'.repeat(4);
        segmentedLog.write('key1', fourB); // 10 size
        segmentedLog.write('key2', fourB); // 10 size
        segmentedLog.write('key3', fourB); // 10 size
        expect(segmentedLog.info().indexedLogSize).toBe(4);
        segmentedLog.compact();
        expect(segmentedLog.info().indexedLogSize).toBe(2);
        expect(segmentedLog.read('key4')?.value).toBe(fourA);
        expect(segmentedLog.read('key3')?.value).toBe(fourB);
        expect(segmentedLog.read('key2')?.value).toBe(fourB);
    });
});