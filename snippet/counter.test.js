describe('counter', () => {
    test('should generate numbers starting from start with step increments', () => {
        const c = counter(5, 3);
        expect(c.next().value).toBe(5);
        expect(c.next().value).toBe(8);
        expect(c.next().value).toBe(11);
        expect(c.next().value).toBe(14);
    });

    test('should work with negative steps', () => {
        const c = counter(10, -2);
        expect(c.next().value).toBe(10);
        expect(c.next().value).toBe(8);
        expect(c.next().value).toBe(6);
        expect(c.next().value).toBe(4);
    });

    test('should work with zero step', () => {
        const c = counter(7, 0);
        expect(c.next().value).toBe(7);
        expect(c.next().value).toBe(7);
        expect(c.next().value).toBe(7);
    });
});