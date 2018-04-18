# _`Nifty Types`_
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ddoronin/nifty-types/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/nifty-types.svg?style=flat)](https://www.npmjs.com/package/nifty-types)
[![Build Status](https://travis-ci.org/ddoronin/nifty-types.svg?branch=master)](https://travis-ci.org/ddoronin/nifty-types) [![Coverage Status](https://coveralls.io/repos/github/ddoronin/nifty-types/badge.svg)](https://coveralls.io/github/ddoronin/nifty-types)

```
npm install nifty-types
```

## Option&lt;A>

Represents optional values. Instances of Option are either an instance of `Some` or the object `None`.

### Motivation
The idea is to get rid of `null` and `undefined` and, thus, eliminate null pointer exceptions, reduce branching (if statement) and produce better code.

The most idiomatic way to use an `Option` instance is to treat it as a collection or monad and use map, flatMap, filter, or foreach:

```typescript
import { Option, some, none } from 'nifty-types';

let name: Option<string> = some(x.getParameter());
let upper: string = name.map(_ => _.trim()).filter(_ => _.length != 0).map(_ => _.toUpperCase()).getOrElse('');
```

### Usage 

```typescript
import { Option, Some, some, None, none } from 'nifty-types';
```

`Option<A>` is a base abstract type (it cannot be instantiated). 

`Some<A> extends Option<A>` is one of the possible implementations of Option that wraps a value. 

`None<A> extends Option<A>` is another possible implementation of Option that doesn't wrap any value.

`some<A>(x: A):Option<A>` is a helper function that receives a value and returns either an instance of Some() 
or the None object if the value is null or undefined.

`none:Option<A>` is an instance of the object None.

#### Creating an option

Usually, you can simply create an `Option<A>` for a present value by directly calling `some()` function:

```typescript
let greeting: Option<string> = some('Hello world');
```

Or, if you know that the value is absent, you simply assign or return the None object:

```typescript
let greeting: Option<string> = none;
```

Notice that `some()` function is smart and returns `none` if a given parameter is null or undefined:

```typescript
let absentGreeting: Option<string> = some(null) // absentGreeting will be none
```

#### Working with options

An `Option` instance should be treated as a collection. Let's consider an example, 
where we have a naive repository of great folks and we need to support operation `find`.

```typescript
// This is generic repository, so it can be used for any type of entities. 
class Repository<T> {
    
    // The collection is an array, so it supports array.find() operation that is used below.
    constructor(private readonly collection: T[]) {
    }

    // This method will return Option, indicating that it can handle "Not found" case.
    find<K extends keyof T>(key: K, val: any): Option<T> {
        // Please notice how some() wraps find result that could be a person or undefined.
        return some(this.collection.find(_ => _[key] === val));
    }
}

class Profile {
    constructor(
        public firstName: string,
        public lastName: string,
        // Let's make this field optional just for more fun, it's a good use case for flatMap().
        public skill: Option<string> = none
    ){ }
}
```

Let's instantiate a specific repository and fill it in with test data.

```typescript
const greatFolksRepo = new Repository([
    new Profile('John', 'Lennon', some('Guitars')),
    new Profile('Paul', 'McCartney', some('Lead Vocals')),
    new Profile('George', 'Harrison', some('Lead guitar')),
    new Profile('Ringo', 'Starr', some('Drums'))
]);
```

Now if we search for John Lennon skill, it should return 'Guitars':
```typescript
let skill = greatFolksRepo.find('firstName', 'John').flatMap(_ => _.skill); // should be some('Guitars')) 
```

But also it should gracefully handle not found:
```typescript
let skill = greatFolksRepo.find('firstName', 'Dima').flatMap(_ => _.skill); // should be none
```

Please find more example [here](https://github.com/ddoronin/nifty-types/blob/master/src/Option.examples.spec.ts).
