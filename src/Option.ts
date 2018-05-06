import { FuncOrVal, funcOrVal } from './utils';

/**
 * Really private method name to be used internally.
 * It's not exposed to a client with intention to not allow having 
 * null and undefined values while working with the `Option` monad.
 */
export const $get = Symbol('get');

export abstract class Option<A> {
    /**
     * Returns true if the option is $none, false otherwise.
     */
    abstract isEmpty(): boolean
    
    /**
     * Returns true if the option is an instance of $some, false otherwise.
     */
    isDefined(): boolean {
        return !this.isEmpty();
    }
    
    /**
     * Returns the option's value.
     * @note The option must be nonempty.
     * @throws RangeError if the option is empty.
     */
    protected abstract [$get](): A

    /**
     * Returns the option's value if the option is nonempty, otherwise
     * return the result of evaluating `default`.
     *
     * @param{FuncOrVal<B>} dft  the default expression.
     */
    getOrElse<B extends A>(dft: FuncOrVal<B>): A|B {
        if (this.isEmpty()) {
            return funcOrVal(dft);
        }
        return this[$get]();
    }

    /**
     * Returns the option's value if it is nonempty,
     * or `null` if it is empty.
     * Although the use of null is discouraged, code written to use
     * $option must often interface with code that expects and returns nulls.
     */
    orNull(): A | null {
        return this.getOrElse(null);
    }

    /**
     * Returns a $some containing the result of applying $f to this $option's
     * value if this $option is nonempty.
     * Otherwise return $none.
     *
     * @note This is similar to `flatMap` except here,
     * $f does not need to wrap its result in an $option.
     *
     * @param  f   the function to apply
     * @see flatMap
     * @see foreach
     */
    map<B>(f: (a: A) => B): Option<B> {
        return this.isEmpty() ? none : some<B>(f(this[$get]()))
    }

    /**
     * Returns the result of applying $f to this $option's
     * value if the $option is nonempty.  Otherwise, evaluates
     * expression `ifEmpty`.
     *
     * @note This is equivalent to `$option map f getOrElse ifEmpty`.
     *
     * @param  ifEmpty the expression to evaluate if empty.
     * @param  f       the function to apply if nonempty.
     */
    fold<B>(ifEmpty: () => B, f: (a: A) => B): B {
        return this.isEmpty() ? ifEmpty(): f(this[$get]());
    }

    /**
     * Returns the result of applying $f to this $option's value if
     * this $option is nonempty.
     * Returns $none if this $option is empty.
     * Slightly different from `map` in that $f is expected to
     * return an $option (which could be $none).
     *
     * @param  f   the function to apply
     * @see map
     * @see foreach
     */
    flatMap<B>(f: (a: A) => Option<B>): Option<B>{
        return this.isEmpty() ? none : f(this[$get]());
    }

    /**
     * Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns true. Otherwise, return $none.
     *
     * @param  p   the predicate used for testing.
     */
    filter(p: ((a: A) => boolean) | A): Option<A> {
        const f = typeof p === 'function' ? p : (_: A) => _ === p;
        return (this.nonEmpty() && f(this[$get]())) ? this : none;
    }

    /**
     * Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns false. Otherwise, return $none.
     *
     * @param  p   the predicate used for testing.
     */
    filterNot(p: ((a: A) => boolean) | A): Option<A> {
        const f = typeof p === 'function' ? p : (_: A) => _ === p;
        return (this.isEmpty() || !f(this[$get]())) ? this : none;
    }

    /**
     * Returns false if the option is $none, true otherwise.
     */
    nonEmpty(): boolean {
        return this.isDefined();
    }

    /**
     * Tests whether the option contains a given value as an element.
     *
     *  @example {{{
     *  // Returns true because some instance contains string "something" which equals "something".
     *  some("something") contains "something"
     *
     *  // Returns false because "something" != "anything".
     *  some("something") contains "anything"
     *
     *  // Returns false when method called on none.
     *  none contains "anything"
     *  }}}
     *
     *  @param elem the element to test.
     *  @return `true` if the option has an element that is equal (as
     *  determined by `==`) to `elem`, `false` otherwise.
     */
    contains(elem: A): boolean {
        return !this.isEmpty() && this[$get]() === elem;
    }

    /**
     * Returns true if this option is nonempty '''and''' the predicate
     * $p returns true when applied to this $option's value.
     * Otherwise, returns false.
     *
     * @param  p   the predicate to test
     */
    exists(p: (a: A) => boolean): boolean {
        return !this.isEmpty() && p(this[$get]());
    }

    /**
     * Returns true if this option is empty '''or''' the predicate
     * $p returns true when applied to this $option's value.
     *
     * @param  p   the predicate to test
     */
    forall(p: (a: A) => boolean): boolean{
        return this.isEmpty() || p(this[$get]());
    }

    /**
     * Apply the given procedure $f to the option's value,
     * if it is nonempty. Otherwise, do nothing.
     *
     * @param  f   the procedure to apply.
     * @see map
     * @see flatMap
     */
    foreach<U>(f: (a: A) => U): void {
        if (!this.isEmpty()) f(this[$get]());
    }

    /**
     * Returns this $option if it is nonempty,
     * otherwise return the result of evaluating `alternative`.
     * @param alternative the alternative expression.
     */
    orElse(alternative: Option<A>): Option<A> {
        if (this.isEmpty()) {
            return alternative;
        }
        return this;
    }

    equals(target: Option<A>): boolean {
        return (
            this.isDefined() && target.isDefined() && this[$get]() === target[$get]()
        ) || (this.isEmpty() && target.isEmpty());
    }

    [Symbol.iterator] = function* () {
        if (this.isDefined()) {
            yield this[$get]();
        }
    }
}

export class Some<A> extends Option<A>{
    constructor(private readonly x: A){
        super();
    }

    isEmpty(): boolean{
        return false;
    }

    protected [$get](): A {
        return this.x;
    }
}

// It would make sense to have None of type `never`, 
// but it could break nice compiler instructions 
// when getOrElse() is called for example.
export class None<A> extends Option<A>{
    isEmpty(): boolean{
        return true;
    }

    protected [$get](): A {
        throw new RangeError('none.get()');
    }
}

export const none = new None<any>();

export const some = <A>(x: A): Option<A> => {
    if(x === null || typeof x === 'undefined'){
        return none as Option<A>;
    }
    return new Some(x);
};
