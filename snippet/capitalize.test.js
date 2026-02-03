describe('capitalize', () => {
    test('should capitalize the first letter of a string', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('world')).toBe('World');
        expect(capitalize('javaScript')).toBe('JavaScript');
        expect(capitalize('a')).toBe('A');
    });

    test('should handle empty strings', () => {
        expect(capitalize('')).toBe('');
    });
});