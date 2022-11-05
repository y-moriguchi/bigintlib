/*
 * This source code is under the Unlicense
 */
function BigIntLib(opt) {
    const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
    const randomGenerator = opt && opt.random ? opt.random() : (function*() {
        while(true) {
            yield Math.random();
        }
    })();
    const log = opt && opt.log ? opt.log : x => {};

    function wrap(value) {
        if(typeof value === "bigint") {
            return value;
        } else if(typeof value === "number" && Number.isSafeInteger(value)) {
            return BigInt(value);
        } else {
            throw new Error("Invalid argument: " + value);
        }
    }

    function* gcdstep(value1, value2) {
        let v1 = me.max(value1, value2);
        let v2 = me.min(value1, value2);

        while(v2 > 0n) {
            const k = v1 / v2;
            const r = v1 % v2;

            yield k;
            v1 = v2;
            v2 = r;
        }
        yield v1;
    }

    function modPowBase(value, exp, modulo, test) {
        const m = wrap(modulo);
        let n = wrap(exp);
        let a = 1n;
        let b = wrap(value);

        while(true) {
            if(n === 0n) {
                return a;
            } else if(n % 2n === 0n) {
                const tb = test(b, m);

                b = (tb * tb) % m;
                n /= 2n;
            } else {
                a = (a * b) % m;
                n--;
            }
        }
    }

    function random0To1(n) {
        if(n <= MAX_SAFE_INTEGER) {
            return BigInt(Math.floor(randomGenerator.next().value * Number(n)));
        } else {
            const denom = MAX_SAFE_INTEGER;
            const numer = random0To1(MAX_SAFE_INTEGER);

            return n * numer / denom;
        }
    }

    function primeByMillerRabinTest(value, certainty) {
        const n = wrap(value);

        function test() {
            function trivialTest(r, m) {
                if(r === 1n || r === m - 1n) {
                    return r;
                } else if((r * r) % m === 1n) {
                    return 0n;
                } else {
                    return r;
                }
            }

            function tryIt(a) {
                return modPowBase(a, n - 1n, n, trivialTest) === 1n;
            }
            return tryIt(1n + random0To1(n - 1n));
        }

        if(typeof certainty !== "number" || certainty < 1 || !Number.isSafeInteger(certainty)) {
            throw new Error("Certainty must be Positive Number: " + certainty);
        }

        for(let i = 0; i < certainty; i++) {
            if(!test()) {
                return false;
            }
        }
        return true;
    }

    function sqrt(number) {
        function toList(num) {
            const result = [];

            for(let v = num; v !== 0n; v = v / 10n) {
                result.push(Number(v % 10n));
            }
            return result;
        }

        function toBigInt(list) {
            let result = 0n;

            for(let i = list.length - 1; i >= 0; i--) {
                result = result * 10n + BigInt(list[i]);
            }
            return result;
        }

        const numlist = toList(number);
        let right = null;
        let root = null;
        let left = null;

        if(numlist.length === 0) {
            return 0n;
        }

        for(let i = Math.floor((numlist.length - 1) / 2) * 2; i >= 0; i -= 2) {
            if(right === null) {
                const init = i + 1 < numlist.length
                             ? numlist[i] + numlist[i + 1] * 10
                             : numlist[i];
                const initroot = Math.floor(Math.sqrt(init));

                root = [initroot];
                right = init - initroot * initroot > 0 ? [init - initroot * initroot] : [];
                left = [initroot * 2];
                log("1");
            } else {
                let left1;

                right = numlist.slice(i, i + 2).concat(right);
                for(j = 1; true; j++) {
                    if(j === 10) {
                        log("2");
                        j--;
                        break;
                    }
                    left1 = [j].concat(left);
                    if(toBigInt(right) < toBigInt(left1) * BigInt(j)) {
                        log("3");
                        j--;
                        break;
                    }
                }
                root = [j].concat(root);
                left1 = [j].concat(left);
                right = toList(toBigInt(right) - toBigInt(left1) * BigInt(j));
                left = toList(toBigInt(left1) + BigInt(j));
            }
        }
        return right.length === 0 ? toBigInt(root) : false;
    };

    const me = {
        max: function(...values) {
            return values.map(wrap).reduce((p, c) => p > c ? p : c);
        },

        min: function(...values) {
            return values.map(wrap).reduce((p, c) => p < c ? p : c);
        },

        gcd: function(value1, value2) {
            const v1 = me.max(value1, value2);
            const v2 = me.min(value1, value2);
            let now, result;

            if(v1 <= 0n) {
                throw new Error("Value must be positive: " + v1);
            } else if(v2 <= 0n) {
                throw new Error("Value must be positive: " + v2);
            }
            for(const gg = gcdstep(v1, v2); !(now = gg.next()).done; result = now.value) { }
            return result;
        },

        modInverse: function(value, mod) {
            const val = wrap(value);
            const m = wrap(mod);

            if(val < 1n) {
                throw new Error("Value must be positive: " + val);
            } else if(me.gcd(val, m) !== 1n) {
                throw new Error("Cannot invert value");
            }

            const ks = [...gcdstep(val, m)].slice(0, -1);
            let x = 0n, y = 1n, u = 1n, v = -ks[ks.length - 1];
            for(let i = ks.length - 2; i >= 0; i--) {
                const x2 = x * 0n + y * 1n;
                const y2 = x * 1n - y * ks[i];
                const u2 = u * 0n + v * 1n;
                const v2 = u * 1n - v * ks[i];
                [x, y, u, v] = [x2, y2, u2, v2];
                log("passed");
            }
            const solution = val > m ? x : y;
            return solution < 0n ? solution + m : solution;
        },

        modPow: function(value, exp, modulo) {
            if(exp < 0n) {
                return me.modPow(me.modInverse(value, modulo), -exp, modulo);
            } else {
                return modPowBase(value, exp, modulo, (b, m) => b);
            }
        },

        isProbablePrime: function(value, certainty) {
            return primeByMillerRabinTest(value, certainty);
        },

        sqrt: function(value) {
            const v = wrap(value);

            if(v < 0n) {
                throw new Error("Value must be positive: " + val);
            }
            return sqrt(v);
        }
    };
    return me;
}

