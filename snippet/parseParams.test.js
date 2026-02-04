describe('parseParams', () => {
    test('should return an empty object for an empty string', () => {
        expect(parseParams('')).toEqual({});
    });

    test('should parse single parameter', () => {
        expect(parseParams('key1=value1')).toEqual({ key1: 'value1' });
    });

    test('should parse multiple parameters', () => {
        expect(parseParams('key1=value1&key2=value2')).toEqual({ key1: 'value1', key2: 'value2' });
    });

    test('should not try to convert numeric values', () => {
        expect(parseParams('key1=123&key2=45.67')).toEqual({ key1: '123', key2: '45.67' });
    });

    test('should handle parameters without values', () => {
        expect(parseParams('key1=&key2=value2')).toEqual({ key1: '', key2: 'value2' });
    });

    test('should ignore parameters without keys', () => {
        expect(parseParams('=value1&key2=value2')).toEqual({ key2: 'value2' });
    });

    test('should keep only the last occurrence of duplicate keys', () => {
        expect(parseParams('key1=value1&key1=value2')).toEqual({ key1: 'value2' });
    });
});