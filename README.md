# _`Nifty Types`_
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ddoronin/nifty-types/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/nifty-types.svg?style=flat)](https://www.npmjs.com/package/nifty-types)
[![Build Status](https://travis-ci.org/ddoronin/nifty-types.svg?branch=master)](https://travis-ci.org/ddoronin/nifty-types) [![Coverage Status](https://coveralls.io/repos/github/ddoronin/nifty-types/badge.svg)](https://coveralls.io/github/ddoronin/nifty-types)

```
npm i nifty-types --save
yarn add nifty-types
```

## Option<A>
```typescript
abstract class Option<A>
```
Represents optional values. Instances of Option are either a result of `Some()` or the object `None`.

### Motivation
The idea is to get rid of `null` and `undefined` and, thus, eliminate null pointer exceptions, reduce branching (if statement) and produce better code.

The most idiomatic way to use an `Option` instance is to treat it as a collection or monad and use map, flatMap, filter, or foreach:

```typescript
import { Option, Some, None } from 'nifty-types';

let name: Option<String> = request.getParameter('name');
let upper = name.map(_ => _.trim()).filter(_ => _.length != 0).map(_ => _.toUpperCase());

console.log(upper.getOrElse(''));
```

### Creating an option

Usually, you can simply create an `Option<A>` for a present value by directly calling `Some()` function:

```typescript
let greeting: Option<String> = Some('Hello world');
```

Or, if you know that the value is absent, you simply assign or return the None object:

```typescript
let greeting: Option<String> = None;
```

Notice that `Some()` function is smart and returns `None` if a given parameter is null or undefined:

```typescript
let absentGreeting: Option<String> = Some(null) // absentGreeting will be None
```

### Example

Let's imagine that we need to implement a repository of users that will be used to find users by id and print their full names.

```typescript
class User{ 
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public age: number,
        public gender: Option[String]
    ){ }
}

class UserRepository {
  private const users = [
      new User(0, "John", "Doe", 32, Some("male")),
      new User(1, "Johanna", "Doe", 30, None))
  ];

  public findById(id: Int): Option[User]{
      return Some(users[id]);
  }
}
```

Now, if you received an instance of `Option<User>` from the `UserRepository` and need to do something with it, how do you do that?

```typescript
let user1 = userRepository.findById(0);
print(user1); // John Doe

let user2 = userRepository.findById(1);
print(user2); // Johana Doe

let user2 = userRepository.findById(2);
print(user3); // N/A
```

Traditionally we would check if a value is not `undefined` and not `null`. Using `Option` you can do more and easier.

```typescript
function print(user: Option<User>){
    let fullName = user.map(_ => `${_.firstName} ${_.secondName}`).getOrElse('N/A');
    console.log(fullName);
}
```
Now, our `print()` function implementation can format users and gracefully display `N/A` when a user is not available.
