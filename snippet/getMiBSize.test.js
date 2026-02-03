describe('getMiBSize', () => {
    const testExample = (input, expected) => {
        test(`should convert ${input} bytes to "${expected}"`, () => {
            expect(getMiBSize(input)).toBe(expected);
        });
    }
    testExample(1048576, '1.00 MiB'); // 1 MB
    testExample(5242880, '5.00 MiB'); // 5 MB
    testExample(15728640, '15.00 MiB'); // 15 MB
    testExample(123456789, '117.74 MiB'); // ~117.74 MB
    testExample(0, '0.00 MiB'); // 0 MB
    testExample(100000, '0.10 MiB'); // 0.10 MB
    testExample(700000, '0.67 MiB'); // 0.67 MB
});