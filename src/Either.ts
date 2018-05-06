import { funcOrVal, FuncOrVal } from "./utils";
import { none, Option, some } from "./Option";

/**
 * Methods available only internally.
 */
export const $isRight = Symbol('isRight');
export const $getLeft = Symbol('getLeft');
export const $getRight = Symbol('getRight');

export abstract class Either<A, B> {

    protected abstract readonly [$isRight]: boolean;

    protected abstract [$getLeft](): A;

    protected abstract [$getRight](): B;

    /** Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
     *
     *  @example {{{
     *  val result = util.Try("42".toInt).toEither
     *  result.fold(
     *    e => s"Operation failed with $e",
     *    v => s"Operation produced value: $v"
     *  )
     *  }}}
     *
     *  @param fa the function to apply if this is a `Left`
     *  @param fb the function to apply if this is a `Right`
     *  @return the results of applying the function
     */
    fold<C>(fa: (a: A) => C, fb: (b: B) => C): C {
        if (this[$isRight]) {
            return fb(this[$getRight]());
        }
        return fa(this[$getLeft]());
    }

    /** If this is a `Left`, then return the left value in `Right` or vice versa.
     *
     *  @example {{{
     *  val left: Either[String, Int]  = Left("left")
     *  val right: Either[Int, String] = left.swap // Result: Right("left")
     *  }}}
     *  @example {{{
     *  val right = Right(2)
     *  val left  = Left(3)
     *  for {
     *    r1 <- right
     *    r2 <- left.swap
     *  } yield r1 * r2 // Right(6)
     *  }}}
     */
    swap(): Either<B, A> {
        if (this[$isRight]) {
            return left(this[$getRight]());
        }
        return right(this[$getLeft]());
    }

    /** Executes the given side-effecting function if this is a `Right`.
     *
     *  {{{
     *  Right(12).foreach(println) // prints "12"
     *  Left(12).foreach(println)  // doesn't print
     *  }}}
     *  @param f The side-effecting function to execute.
     */
    foreach<U>(f: (b: B) => U): Either<A, B> {
        if (this[$isRight]) {
            f(this[$getRight]());
        }
        return this;
    }

    /**
     * Executes the given side-effecting function if this is a `Left`.
     * @param f The side-effecting function to execute.
     */
    foreachLeft<V>(f: (a: A) => V): Either<A, B> {
        if (!this[$isRight]) {
            f(this[$getLeft]());
        }
        return this;
    }

    /** Returns the value from this `Right` or the given argument if this is a `Left`.
     *
     *  {{{
     *  Right(12).getOrElse(17) // 12
     *  Left(12).getOrElse(17)  // 17
     *  }}}
     */
    getOrElse<B1 extends B>(or: FuncOrVal<B1>): B {
        if (this[$isRight]) {
            return this[$getRight]();
        }
        return funcOrVal(or);
    }

    /** Returns `true` if this is a `Right` and its value is equal to `elem` (as determined by `===`),
     *  returns `false` otherwise.
     *
     *  {{{
     *  // Returns true because value of Right is "something" which equals "something".
     *  Right("something") contains "something"
     *
     *  // Returns false because value of Right is "something" which does not equal "anything".
     *  Right("something") contains "anything"
     *
     *  // Returns false because it's not a Right value.
     *  Left("something") contains "something"
     *  }}}
     *
     *  @param elem    the element to test.
     *  @return `true` if this is a `Right` value equal to `elem`.
     */
    contains<B1 extends B>(elem: B1): boolean {
        return this[$isRight] && this[$getRight]() === elem;
    }

    /**
     * Returns `true` if this is a `Left` and its value is equal to `elem`.
     * @param elem
     */
    containsLeft<A1 extends A>(elem: A1): boolean {
        return !this[$isRight] && this[$getLeft]() === elem;
    }

    /** Returns `false` if `Left` or returns the result of the application of
     *  the given predicate to the `Right` value.
     *
     *  {{{
     *  Right(12).exists(_ > 10)   // true
     *  Right(7).exists(_ > 10)    // false
     *  Left(12).exists(_ => true) // false
     *  }}}
     */
    exists(p: (b: B) => boolean): boolean {
        return this[$isRight] && p(this[$getRight]());
    }

    /**
     * Returns `false` if `Right` or returns the result of the application or 
     * the given predicate to the `Left` value.
     * @param p
     */
    existsLeft(p: (a: A) => boolean): boolean {
        return !this[$isRight] && p(this[$getLeft]());
    }

    /** The given function is applied if this is a `Right`.
     *
     *  {{{
     *  Right(12).map(x => "flower") // Result: Right("flower")
     *  Left(12).map(x => "flower")  // Result: Left(12)
     *  }}}
     */
    map<B1>(f: (b: B) => B1): Either<A, B1> {
        if (this[$isRight]) {
            return right(f(this[$getRight]()));
        }
        return left(this[$getLeft]());
    }

    /**
     * The given function is applied if this is a `Left`.
     * @param f
     */
    mapLeft<A1>(f: (a: A) => A1): Either<A1, B> {
        if (!this[$isRight]) {
            return left(f(this[$getLeft]()));
        }
        return right(this[$getRight]());
    }

    /** Returns `Right` with the existing value of `Right` if this is a `Right`
     *  and the given predicate `p` holds for the right value,
     *  or `Left(zero)` if this is a `Right` and the given predicate `p` does not hold for the right value,
     *  or `Left` with the existing value of `Left` if this is a `Left`.
     *
     * {{{
     * Right(12).filterOrElse(_ > 10, -1)   // Right(12)
     * Right(7).filterOrElse(_ > 10, -1)    // Left(-1)
     * Left(7).filterOrElse(_ => false, -1) // Left(7)
     * }}}
     */
    filterOrElse(p: (b: B) => boolean, zero: FuncOrVal<A>): Either<A, B> {
        if (this[$isRight] && !p(this[$getRight]())) {
            return left(funcOrVal(zero));
        }
        return this;
    }

    /** Returns a `Some` containing the `Right` value
     *  if it exists or a `None` if this is a `Left`.
     *
     * {{{
     * Right(12).toOption // Some(12)
     * Left(12).toOption  // None
     * }}}
     */
    toOption(): Option<B> {
        if (this[$isRight]) {
            return some(this[$getRight]());
        }
        return none;
    }

    /** If the condition is satisfied, return the given `B` in `Right`,
     *  otherwise, return the given `A` in `Left`.
     *
     *  {{{
     *  val userInput: String = readLine()
     *  Either.cond(
     *    userInput.forall(_.isDigit) && userInput.size == 10,
     *    PhoneNumber(userInput),
     *    s"The input ($userInput) does not look like a phone number"
     *  }}}
     */
    public static cond<A, B>(test: boolean, right: B, left: A): Either<A, B> {
        if (test) {
            return new Right(right);
        }
        return new Left(left);
    }

    [Symbol.iterator] = function* () {
        if (this[$isRight]) {
            yield this[$getRight]();
        }
    }
}

/** The left side of the disjoint union.
 */
export class Left<A, B> extends Either<A, B> {
    protected readonly [$isRight]: false;

    protected [$getLeft](): A {
        return this.x;
    }

    protected [$getRight](): B {
        throw new RangeError('Left.getRight()');
    }

    constructor(private readonly x: A) {
        super();
    }
}

export function left<A, B>(x: A): Either<A, B> {
    return new Left<A, B>(x);
}

/** The right side of the disjoint union.
 */
export class Right<A, B> extends Either<A, B> {
    protected readonly [$isRight]: boolean = true;

    protected [$getLeft](): A {
        throw new RangeError('Right.getLeft()');
    }

    protected [$getRight](): B {
        return this.x;
    }

    constructor(private readonly x: B) {
        super();
    }
}

export function right<A, B>(x: B): Either<A, B> {
    return new Right<A, B>(x);
}
