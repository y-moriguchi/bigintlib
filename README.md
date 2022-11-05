# BigIntLib

BigIntLib is a utility functions for ECMAScript standard BigInt.

## How to use

You can use BigIntLib by calling global BigIntLib object and bind this object to any constants.

```javascript
const b = BigIntLib();
```

Arguments passing to BigIntLib functions can use usual safe integer which is not BigInt.

## Functions

### max

The max function returns the maximum number of given arguments.

```javascript
const max = b.max(2, 5, 3n);   // result is 5n
```

### min

The min function returns the minimum number of given arguments.

```javascript
const max = b.max(2, 5, 3n);   // result is 2n
```

### gcd

The gcd function returns the greatest common divisor of two arguments.

```javascript
const gcd = b.gcd(200, 15);    // result is 5n
```

### modInverse

The modInverse function returns the inverse of the first argument modulo the second argument.  
If the arguments can not invert, throw the exception.

```javascript
const inv = b.modInverse(20n, 3);   // result is 2n
```

### modPow

The modPow function returns the power of the first argument to the second argument modulo the third argument.
If the second argument is negative and the arguments can not compute, throw the exception.

```javascript
const pow1 = b.modPow(2, 8, 10);     // result is 6n
const pow2 = b.modPow(3, -2, 20n);   // result is 9n
```

### isProbablePrime

The isProbablePrime function returns the first argument is probable prime by certanity of second argument.  
This function returns true if the first argument is probable prime
and returns false is the number is definity composite.

Certanity must be a usual safe integer, not BigInt.  
This method uses Miller-Rabin test.

```javascript
const is1 = b.isProbablePrime(31, 100);                 // result is true
const is2 = b.isProbablePrime(1827, 100);               // result is false
const is3 = b.isProbablePrime(2n ** 127n - 1n, 100);    // result is true
```

### sqrt

The sqrt function returns the square root of the argument if it is an integer
or false if it is not an integer.

```javascript
const sqrt1 = b.sqrt(841n);   // result is 29n
const sqrt2 = b.sqrt(765n);   // result is false
```

