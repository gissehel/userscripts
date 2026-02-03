describe('splitLast', () => {
    test('should split the last occurrence of a delimiter', () => {
        expect(splitLast('a/b/c/d', '/')).toEqual(['a/b/c', 'd']);
        expect(splitLast('one.two.three.four', '.')).toEqual(['one.two.three', 'four']);
        expect(splitLast('no-separator-here', ',')).toEqual(['no-separator-here', '']);
        expect(splitLast('ends/with/slash/', '/')).toEqual(['ends/with/slash', '']);
        expect(splitLast('/starts/with/slash', '/')).toEqual(['/starts/with', 'slash']);
    });

    test('should handle empty strings', () => {
        expect(splitLast('', '/')).toEqual(['', '']);
        expect(splitLast('onlyonepart', ',')).toEqual(['onlyonepart', '']);
    });
});