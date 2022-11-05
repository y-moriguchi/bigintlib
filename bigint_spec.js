/*
 * This source code is under the Unlicense
 */
describe("BigIntLib", function () {
    beforeEach(function () {
    });

    describe("testing BigIntLib", function () {

        it("max", function() {
            b = BigIntLib();
            expect(b.max(2, 3n, 5)).toBe(5n);
        });

        it("min", function() {
            b = BigIntLib();
            expect(b.min(2, 3n, 5)).toBe(2n);
        });

        it("gcd", function() {
            b = BigIntLib();
            expect(b.gcd(200n, 15)).toBe(5n);
            expect(b.gcd(15n, 200)).toBe(5n);
            expect(b.gcd(31n, 15)).toBe(1n);
            expect(() => b.gcd(-2n, 5)).toThrow();
            expect(() => b.gcd(2n, -5)).toThrow();
        });

        it("modInverse", function() {
            let passed = "";
            b = BigIntLib({ log: x => { passed = passed + x; } });
            expect(() => b.modInverse(2, 6n)).toThrow();
            expect(() => b.modInverse(-2, 5n)).toThrow();
            expect(b.modInverse(3, 20n)).toBe(7n);
            expect(b.modInverse(20n, 3)).toBe(2n);
            expect(b.modInverse(765, 31n)).toBe(3n);
            expect(b.modInverse(1234567, 743)).toBe(82n);
            expect(passed !== "").toBeTruthy();
        });

        it("modPow", function() {
            b = BigIntLib();
            expect(b.modPow(2, 8, 10)).toBe(6n);
            expect(b.modPow(2, 11, 10)).toBe(8n);
            expect(b.modPow(2, 0, 10)).toBe(1n);
            expect(b.modPow(3, -2, 20n)).toBe(9n);
            expect(() => b.modPow(2, -2, 6n)).toThrow();
        });

        it("isProbablePrime", function() {
            let reset = true;
            function* testRandom() {
                while(true) {
                    if(reset) {
                        yield 0;
                        yield 0.99999999999999
                        reset = false;
                    } else {
                        yield Math.random();
                    }
                }
            };
            b = BigIntLib({ random: testRandom });
            expect(b.isProbablePrime(31, 100)).toBeTruthy();
            expect(b.isProbablePrime(1827, 100)).toBeFalsy();
            expect(b.isProbablePrime(2n ** 127n - 1n, 100)).toBeTruthy();
            expect(b.isProbablePrime(2n ** 113n - 1n, 100)).toBeFalsy();
            expect(b.isProbablePrime(1729, 100)).toBeFalsy();
            expect(() => b.isProbablePrime(31, "invalid")).toThrow();
            expect(() => b.isProbablePrime(31, 0)).toThrow();
            expect(() => b.isProbablePrime(31, 1.5)).toThrow();

            reset = true;
            expect(b.isProbablePrime(2n ** 127n - 1n, 100)).toBeTruthy();
            reset = true;
            expect(b.isProbablePrime(2n ** 113n - 1n, 100)).toBeFalsy();
        });

        it("sqrt", function() {
            let passed = "";
            b = BigIntLib({ log: x => { passed = passed + x; } });
            expect(() => b.sqrt(-1n)).toThrow();
            for(let i = 0; i < 20000; i++) {
                const big = b.sqrt(i);
                const jmath = Math.sqrt(i);

                if(Number.isSafeInteger(jmath)) {
                    expect(big).toBe(BigInt(jmath));
                } else {
                    expect(big).toBeFalsy();
                }
            }
            expect(passed.indexOf("1") >= 0).toBeTruthy();
            expect(passed.indexOf("2") >= 0).toBeTruthy();
            expect(passed.indexOf("3") >= 0).toBeTruthy();
        });
    });
});

