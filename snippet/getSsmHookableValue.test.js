function window() {} // ugly trick to make "window" accessible before declaration

describe('getSsmHookableValue', () => {
    beforeEach(() => {
        Object.keys(realWindow).forEach((key)=>{ delete realWindow[key]; })
    });

    test('should return the same HookableValue instance for the same localName and name', () => {
        const hv1 = getSsmHookableValue('local1', 'value1', 42);
        const hv2 = getSsmHookableValue('local1', 'value1', 100);
        expect(hv1).toBe(hv2);
        expect(hv1.value).toBe(42);
    });

    test('should return different HookableValue instances for different names', () => {
        const hv1 = getSsmHookableValue('local1', 'value1', 'foo');
        const hv2 = getSsmHookableValue('local1', 'value2', 'bar');
        expect(hv1).not.toBe(hv2);
        expect(hv1.value).toBe('foo');
        expect(hv2.value).toBe('bar');
    });

    test('should return different HookableValue instances for different localNames', () => {
        const hv1 = getSsmHookableValue('local1', 'value1', true);
        const hv2 = getSsmHookableValue('local2', 'value1', false);
        expect(hv1).not.toBe(hv2);
        expect(hv1.value).toBe(true);
        expect(hv2.value).toBe(false);
    });

    test('should use null as default value if none is provided', () => {
        const hv = getSsmHookableValue('local1', 'value1');
        expect(hv.value).toBeNull();
    });

    test('should execute hook when value changes', () => {
        const hv = getSsmHookableValue('local1', 'value1', 10);
        let hookCalled = false;
        hv.register((newValue, oldValue) => {
            hookCalled = true;
            expect(oldValue).toBe(10);
            expect(newValue).toBe(20);
        });
        expect(hookCalled).toBe(false);
        hv.value = 20;
        expect(hookCalled).toBe(true);
    });
});
