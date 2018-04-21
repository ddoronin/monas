# **_`Nifty Types`_**  _inspired by Scala_ [<img src="http://www.scala-lang.org/resources/img/frontpage/scala-spiral.png" alt="Drawing" width="20px"/>](http://www.scala-lang.org/)               

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ddoronin/nifty-types/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/nifty-types.svg?style=flat)](https://www.npmjs.com/package/nifty-types)
[![Build Status](https://travis-ci.org/ddoronin/nifty-types.svg?branch=master)](https://travis-ci.org/ddoronin/nifty-types) [![Coverage Status](https://coveralls.io/repos/github/ddoronin/nifty-types/badge.svg)](https://coveralls.io/github/ddoronin/nifty-types)

_introduces `Option<A>` and `Either<A, B>` for Javascript._

```
npm install nifty-types
```

## Option&lt;A>

Represents optional values. Instances of Option are either an instance of `Some` or the object `None`.

The idea is to get rid of `null` and `undefined` and, thus, eliminate null pointer exceptions, reduce branching (if statement) and produce better code.

| Exported | Description |
| ------ | ----------- |
| `Option<A>`  | the base **abstract** class that implements utility functions for instances of classes `Some` and `None`. It's primarily used to indicate that a type has an optional value. |
| `Some<A>` |  one of the possible implementations of `Option<A>` that wraps a value. The incapsulated value is available by the `get()` method. |
| `None<A>` | another implementation of `Option<A>` indicating absence of value.|
| `some<A>(x: A):Option<A>` | a helper function instantiating objects of type `Some` or `None` based on a provided value.|
| `none:Option<A>` | a single instance of `None<A>`. |

Usually, you can simply create an `Option<A>` for a present value by directly calling `some()` function:

```typescript
let greeting: Option<string> = some('Hello world');
```

Or, if you know that the value is absent, you simply assign or return the None object:

```typescript
let greeting: Option<string> = none;
```

The function `some()` is smart and returns `none` if a given parameter is null or undefined:

```typescript
let absentGreeting: Option<string> = some(null) // absentGreeting will be none
```

The most idiomatic way to use an `Option` instance is to treat it as a collection or monad and use map, flatMap, filter, or foreach:

For example, for a given country code we want to find the country name or print "N/A" if it's not found. 

```typescript
import { Option, none, some} from './Option';

type Country = {name: string, code: number};
let countries: Country[] = [{
    name: 'United States', code: 1
}, {
    name: 'United Kingdom', code: 44
}];

function getNameByCode(code: number): string {
    // find a country by code
    const country = countries.find(c => c.code === code);

    // if the country is not null return the name or N/A
    return some(country).map(_ => _.name).getOrElse('N/A');
    //     ^^^           ^^^ select name   ^^^ get a value if exists
    //  create Option                          otherwise use 'N/A'
}
```

More examples could be found [here](https://github.com/ddoronin/nifty-types/blob/master/src/Option.examples.spec.ts).

## Either&lt;A, B>

Represents a value of one of two possible types (a disjoint union). 
An instance of Either is an instance of either `Left` or `Right`.
Convention dictates that Left is used for failure and Right is used for success.

| Exported | Description |
| ------ | ----------- |
| `Either<A, B>`| the base **abstract** class that implements utility functions for instances of classes `Left` and `Right`. |
| `Right<A, B>` | a right ("good") part. |
| `Left<A, B>` | a left part, e.g. Error. |
| `right<A, B>(x: B): Either<A, B>` | a helper function instantiating `Right` objects. |
| `left<A, B>(x: B): Either<A, B>` | a helper function instantiating `Left` objects. |

`Either` is really nifty for validation logic when you want to return either a successfully 
parsed value, or a validation error.

It can be used in forms validation when we need to check that 
a give field satisfied some conditions, e.g. age is a number in a range. 

```typescript
import { Either, left, right } from 'nifty-types';

const AGE_MIN = 14;
const AGE_MAX = 30;

function validateAge(input: string): Either<string, number> {
    try {
        let age: number = parseInt(input, 10);
        if(isNaN(age)){
            throw new Error('Invalid input, the age should be a number.');
        }

        if(age < AGE_MIN || age > AGE_MAX){
            throw new RangeError(`The age should be in range between ${AGE_MIN} and ${AGE_MAX}.`);
        }

        // The age is valid, it's right.
        return right(age);
    } catch (e) {
        // There are some validation errors.
        return left(e.message);
    }
}

// Usage
validateAge(20).fold(age => console.info(age), error => console.error(error));
//                   ^^^ on success            ^^^ on error
```

More examples could be found [here](https://github.com/ddoronin/nifty-types/blob/master/src/Either.examples.spec.ts).
