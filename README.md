# <a href='https://ddoronin.github.io/monas/'><img src="https://github.com/ddoronin/monas/raw/master/assets/Monas.png" alt="μονάς - Scala like monads for javascript" height="80px"/></a>

Monas (from Greek μονάς - "singularity") is a monad library for JavaScript apps. It's been inspired by [Scala](https://www.scala-lang.org) and developed with [TypeScript](http://www.typescriptlang.org). Monas introduces two fundamental monads: `Option<A>` and `Either<A, B>`.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ddoronin/monas/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/monas.svg?style=flat)](https://www.npmjs.com/package/monas) 
[![Build Status](https://travis-ci.org/ddoronin/monas.svg?branch=master)](https://travis-ci.org/ddoronin/monas) 
[![Coverage Status](https://coveralls.io/repos/github/ddoronin/monas/badge.svg?branch=master)](https://coveralls.io/github/ddoronin/monas?branch=master)
[![Slack chat](https://now-examples-slackin-fpiresrxzs.now.sh/badge.svg)](https://now-examples-slackin-fpiresrxzs.now.sh) 

```bash
$ yarn add monas
```

## Option&lt;A>

Represents optional values. Instances of Option are either an instance of `Some` or the object `None`.

The idea is to get rid of `null` and `undefined` and, thus, eliminate null pointer exceptions, reduce branching (if statement) and produce better code.

| &nbsp;Exported&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Description |
| ------ | ----------- |
| `Option<A>`  | the base **abstract** class that implements utility functions for instances of classes `Some` and `None`. It's primarily used to indicate that a type has an optional value. |
| `Some<A>` |  one of the possible implementations of `Option<A>` that wraps a value. The incapsulated value is available by the `get()` method. |
| `None<A>` | another implementation of `Option<A>` indicating absence of value.|
| `some<A>(x: A): Option<A>` | a helper function instantiating objects of type `Some` or `None` based on a provided value.|
| `none: Option<A>` | a single instance of `None<A>`. |


```typescript
let greeting: Option<string> = some('Hello world');
greeting = some(null); // will be none
assert(greeting === none);
```
`some()` will return `none` if a given argument is `null` or `undefined`:

Reading data from `Option`:

a) `getOrElse()`:
```typescript
let str: string = greeting.getOrElse(''); 
// Returns greeting or empty string if none.
```

b) `get()`:
```typescript
let str: string = greeting.get(); 
// Returns greeting or throws an exception.
```

c) Using `Symbol.Iterable`:
```typescript
let [str]: string = [...greeting]; 
// returns ["something"] or empty array [] if none.
```
OR
```typescript
for(let str: string of greeting) {
    assert(str, "something");
}
```

### Examples

The most idiomatic way to use an `Option` instance is to treat it as a collection or monad and use map, flatMap, filter, or foreach.

Let's consider an example where for a given country code we need to find the country name or print "N/A" if it's not found. 

```typescript
import { Option, none, some } from './Option';

type Country = { name: string, code: number };
let countries: Country[] = [{ name: 'United States', code: 1 }, { name: 'United Kingdom', code: 44 }];

function getNameByCode(code: number): string {
    // find a country by code
    const country = countries.find(c => c.code === code);

    // if the country is not null return the name or N/A
    return some(country).map(_ => _.name).getOrElse('N/A');
    //     ^^^           ^^^ select name   ^^^ get a value if exists
    //     create Option<Country>              otherwise use 'N/A'
}
```

More examples could be found [here](https://github.com/ddoronin/monas/blob/master/test/Option.examples.spec.ts).

## Either&lt;A, B>

Represents a value of one of two possible types (a disjoint union). 
An instance of Either is an instance of either `Left` or `Right`.
Convention dictates that Left is used for failure and Right is used for success.

| &nbsp;Exported&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| ------ | ----------- |
| `Either<A, B>`| the base **abstract** class that implements utility functions for instances of classes `Left` and `Right`. |
| `Right<A, B>` | a right "good" part. |
| `Left<A, B>` | a left "fail over" part, e.g. Error. |
| `right<A, B>(x: B): Either<A, B>` | a helper function instantiating `Right` objects. |
| `left<A, B>(x: B): Either<A, B>` | a helper function instantiating `Left` objects. |

Generally `Either` can be considered as an alternative to `Option` where instead of 
`None` a useful information could be encapsulated into `Left`. 
It turns out that `Either` is a power-full type for validations 
since it can return either a successfully parsed value, or a validation error.

`Either<A, B>` can be instantiated by calling `right(something)` or `left(error)`:

```typescript
let eitherNumber: Either<Error, number> = right(42); // equivalent to new Right(42)
```

OR

```typescript
let eitherNumber: Either<Error, number> = left(Error('Not a number')); // equivalent to new Left('Not a number')
```

`Either` is a right-biased monad:
```typescript
let eitherNum: Either<number, Error> = right<number, Error>(42);
eitherNum.map(num => num * 2).getOrElse(-1);
// returns 84
```
Another example:
```typescript
let eitherNum: Either<number, Error> = left<number, Error>(Error('Not a number.'));
eitherNum.map(_ => _ * 2).getOrElse(-1);
// returns -1
```
Use `mapLeft()`, `foreachLeft()` to handle `Left` values:

```typescript
function print(numberOrError: Either<Error, number>) {
    numberOrError
        .map(num => num)
        .foreach(printNumber)
        .mapLeft(err => err.message)
        .foreachLeft(printError);
}
```

Use `swap()` function to swap `Left` and `Right`.

```typescript
left<number, string>('Not a number').swap().getOrElse('');
// returns 'Not a number'
```

`Either` implements `Symbol.Iterable`:
```typescript
let eitherNumber = right<number, Error>(42).map(_ => _ * 2);

let [n] = [...eitherNumber]; // n === 42

for(let num of eitherNumber) {
    assert(num, 42);
}
```

More examples could be found [here](https://github.com/ddoronin/monas/blob/master/test/Either.examples.spec.ts).

## Docs

1. Medium
  [Monas — Scala monads for javascript](https://medium.com/@dmitrydoronin/monas-scala-monads-for-javascript-1e9cd7e82113)


## License

MIT
