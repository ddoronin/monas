<img src="https://github.com/ddoronin/monas/blob/master/assets/monad.png" alt="μονάς - Scala like monads for javascript" width="80px"/>

# **_`Monas`_**  _inspired by Scala_ [<img src="https://github.com/ddoronin/monas/blob/master/assets/scala-spiral.png" alt="Scala" width="20px"/>](http://www.scala-lang.org/), _developed for Ninjas_ [<img src="https://github.com/ddoronin/monas/blob/master/assets/ninja.png" alt="Ninja" width="48px"/>]()

_introduces fundamental monads: `Option<A>` and `Either<A, B>` - for Javascript Ninjas._

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ddoronin/monas/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/monas.svg?style=flat)](https://www.npmjs.com/package/monas) 
[![Build Status](https://travis-ci.org/ddoronin/monas.svg?branch=master)](https://travis-ci.org/ddoronin/monas) 
[![Coverage Status](https://coveralls.io/repos/github/ddoronin/monas/badge.svg?branch=master)](https://coveralls.io/github/ddoronin/monas?branch=master)
[![Slack chat](https://now-examples-slackin-fpiresrxzs.now.sh/badge.svg)](https://now-examples-slackin-fpiresrxzs.now.sh) 

```
npm install monas
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

### Creating an option

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

### Getting an option value

There are several ways of getting an Option value:

a) Call `getOrElse()`:
```typescript
let str: String = greeting.getOrElse(''); 
// if greeting is None, it will return an empty string.
```

c) class `Option` implements `Symbol.Iterable`, so there is a cute funny way for getting an option value:
```typescript
let [str]: String = [...greeting]; 
// a result of this spread operator will be either an array of one element if Option is Some 
// or an empty array if it's None.
```
d) and the last but not least approach should make full-metal Javascript Ninjas cry in happiness:
```typescript
for(let str: String of greeting) {
    // this will be executed only is greeting has Some value.
}
```

### Working with options

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

### Creating an either

Usually, you can simply create an `Either<A, B>` by directly calling `right()` or `left()` helper functions:

```typescript
let eitherNumber: Either<string, number> = right(42); // equivalent to new Right(42)
```

or

```typescript
let eitherNumber: Either<string, number> = left('Not a number'); // equivalent to new Left('Not a number')
```

### Extracting values from `Either`

`Either` is a right-biased monad, which means that `Right` is assumed to be the default case to operate on. 
If it is `Left`, operations like `map` and `flatMap` return the `Left` value unchanged:

```typescript
right<number, string>(42).map(_ => _ * 2).getOrElse(-1); // 84
//                        ^^^             ^^^ will get 84 from the right 
//                        map will be applied to the right part 
```

or

```typescript
left<number, string>('').map(_ => _ * 2).getOrElse(-1);  // -1
//                       ^^^             ^^^ will print -1 because there's no any right
//                       won't be applied since it's left
```

In the same time `Either` working with the `Left` part could be easy and isomorphic, consider this example:

```typescript
function print(numberOrError: Either<Error, number>) {
    numberOrError
        .map(num => num)
        .foreach(printNumber)
        // For the `Left` part just add suffix Left
        .mapLeft(err => err.message)
        .foreachLeft(printError);
}
```

If there is a need to work with `Left` as with `Right`, the `swap()` function could be used.

```typescript
left<number, string>('useful info').swap().getOrElse('');  // useful info
//                                  /^^^   ^^^ here 'useful info' is "right" 
//             swap Left and Right /
```

For hardcore Javascript Ninjas `Either` implements `Symbol.Iterable`, so enjoy:
```typescript
let eitherNumber = right<number, string>(42).map(_ => _ * 2);

let [n] = [...eitherNumber]; // n === 42

for(let num of eitherNumber) {
    // for ensures that the num will be 42
}
```

More examples could be found [here](https://github.com/ddoronin/monas/blob/master/test/Either.examples.spec.ts).

## License

MIT