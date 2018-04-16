# nifty-types

## Option

```typescript
abstract class Option<A>
```

### Motivation

The idea is to get rid of `null` and `undefined` and thus eliminate null pointer exceptions, reduce branching (if statement) to produce better code.

The `Option` entity represents optional values. Instances of Option are either a result of `Some()` or the object `None`.

The most idiomatic way to use an `Option` instance is to treat it as a collection or monad and use map, flatMap, filter, or foreach:

```typescript
import { Option, Some, None } from 'nifty-types';

let name: Option[String] = request.getParameter('name');
let upper = name.map(_ => _.trim()).filter(_ => _.length != 0).map(_ => _.toUpperCase());

console.log(upper.getOrElse(''));
```

if None is returned from `request.getParameter()`, the `upper` expression results in `None` and empty string will be printed in the console.

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

Let's imagine that we need to implement a repository of users.

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

Traditionally we would check if a value is present and it's not null. Using `Option` it's even easier.

```typescript
function print(user: Option<User>){
    let fullName = user.map(_ => `${_.firstName} ${_.secondName}`).getOrElse('N/A');
    console.log(fullName);
}
```
Now, our `print()` function implementation can format users and gracefully display 'N/A' when a user is not available.
