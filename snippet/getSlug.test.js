describe('getSlug', () => {
    const testExample = (input, expected, options) => {
        test(`should convert "${input}" (with options: ${JSON.stringify(options)}) to "${expected}"`, () => {
            expect(getSlug(input, options)).toBe(expected);
        });
    }
    testExample('Hello World!', 'hello-world');
    testExample('  Leading and trailing spaces  ', 'leading-and-trailing-spaces');
    testExample('Special #$&* Characters', 'special-characters');
    testExample('Multiple    Spaces', 'multiple-spaces');
    testExample('UPPERCASE to lowercase', 'uppercase-to-lowercase');
    testExample('Accented éàü Characters', 'accented-eau-characters');
    testExample('Mixed-Separators_and Spaces', 'mixed-separators-and-spaces');
    testExample('', '');
    testExample('ßpecial', 'sspecial');

    testExample('Hello World!', 'Hello-World', {case: true});
    testExample('  Leading and trailing spaces  ', 'Leading-and-trailing-spaces', {case: true});
    testExample('Special #$&* Characters', 'Special-Characters', {case: true});
    testExample('Multiple    Spaces', 'Multiple-Spaces', {case: true});
    testExample('UPPERCASE to lowercase', 'UPPERCASE-to-lowercase', {case: true});
    testExample('Accented éàü Characters', 'Accented-eau-Characters', {case: true});
    testExample('Mixed-Separators_and Spaces', 'Mixed-Separators-and-Spaces', {case: true});
    testExample('', '');
    testExample('ßpecial', 'sspecial', {case: true});

    testExample('Hello World!', 'Hello.World', {case: true, separator: '.'});
    testExample('  Leading and trailing spaces  ', 'Leading.and.trailing.spaces', {case: true, separator: '.'});
    testExample('Special #$&* Characters', 'Special.Characters', {case: true, separator: '.'});
    testExample('Multiple    Spaces', 'Multiple.Spaces', {case: true, separator: '.'});
    testExample('UPPERCASE to lowercase', 'UPPERCASE.to.lowercase', {case: true, separator: '.'});
    testExample('Accented éàü Characters', 'Accented.eau.Characters', {case: true, separator: '.'});
    testExample('Mixed-Separators_and Spaces', 'Mixed.Separators.and.Spaces', {case: true, separator: '.'});
    testExample('', '');
    testExample('ßpecial', 'sspecial', {case: true});
})