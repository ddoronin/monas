import {FuncOrVal, funcOrVal} from './utils';

export abstract class Option<A> {
    /** Returns true if the option is $none, false otherwise.
     */
    abstract isEmpty(): boolean
    
    /** Returns true if the option is an instance of $some, false otherwise.
     */
    isDefined(): boolean {
        return !this.isEmpty();
    }
    
    /** Returns the option's value.
     *  @note The option must be nonempty.
     *  @throws RangeError if the option is empty.
     */
    abstract get(): A
    
    /** Returns the option's value if the option is nonempty, otherwise
     * return the result of evaluating `default`.
     *
     *  @param{FuncOrVal<B>} dft  the default expression.
     */
    getOrElse<B extends A>(dft: FuncOrVal<B>): A|B {
        if (this.isEmpty()) {
            return funcOrVal(dft);
        }
        return this.get();
    }

    /** Returns the option's value if it is nonempty,
     * or `null` if it is empty.
     * Although the use of null is discouraged, code written to use
     * $option must often interface with code that expects and returns nulls.
     * @example {{{
     * val initialText: Option[String] = getInitialText
     * val textField = new JComponent(initialText.orNull,20)
     * }}}
     */
    orNull(): A | null {
        return this.getOrElse(null);
    }

    /** Returns a $some containing the result of applying $f to this $option's
     * value if this $option is nonempty.
     * Otherwise return $none.
     *
     *  @note This is similar to `flatMap` except here,
     *  $f does not need to wrap its result in an $option.
     *
     *  @param  f   the function to apply
     *  @see flatMap
     *  @see foreach
     */
    map<B>(f: (a: A) => B): Option<B> {
        return this.isEmpty() ? none : some<B>(f(this.get()))
    }

    /** Returns the result of applying $f to this $option's
     *  value if the $option is nonempty.  Otherwise, evaluates
     *  expression `ifEmpty`.
     *
     *  @note This is equivalent to `$option map f getOrElse ifEmpty`.
     *
     *  @param  ifEmpty the expression to evaluate if empty.
     *  @param  f       the function to apply if nonempty.
     */
    fold<B>(ifEmpty: () => B, f: (a: A) => B): B {
        return this.isEmpty() ? ifEmpty(): f(this.get());
    }

    /** Returns the result of applying $f to this $option's value if
     * this $option is nonempty.
     * Returns $none if this $option is empty.
     * Slightly different from `map` in that $f is expected to
     * return an $option (which could be $none).
     *
     *  @param  f   the function to apply
     *  @see map
     *  @see foreach
     */
    flatMap<B>(f: (a: A) => Option<B>): Option<B>{
        return this.isEmpty() ? none : f(this.get());
    }

    /* TODO: No way to say ts that <B> should be of type A: Option<B>
    flatten(): A | TNone<A> {
        return this.isEmpty() ? none : this.get();
    }
    */

    /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns true. Otherwise, return $none.
     *
     *  @param  p   the predicate used for testing.
     */
    filter(p: (a: A) => boolean | A): Option<A> {
        const f = typeof p === 'function' ? p : (_: A) => _ === p;
        return (this.nonEmpty() && f(this.get())) ? this : none;
    }

    /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns false. Otherwise, return $none.
     *
     *  @param  p   the predicate used for testing.
     */
    filterNot(p: (a: A) => boolean | A): Option<A> {
        const f = typeof p === 'function' ? p : (_: A) => _ === p;
        return (this.isEmpty() || !f(this.get())) ? this : none;
    }

    /** Returns false if the option is $none, true otherwise.
     */
    nonEmpty(): boolean {
        return this.isDefined();
    }


    /** Necessary to keep $option from being implicitly converted to
     *  [[scala.collection.Iterable]] in `for` comprehensions.
     */
    withFilter(p: (a: A) => boolean): WithFilter<A> {
        return new WithFilter(this, p);
    }

    /** Tests whether the option contains a given value as an element.
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
        return !this.isEmpty() && this.get() === elem;
    }

    /** Returns true if this option is nonempty '''and''' the predicate
     * $p returns true when applied to this $option's value.
     * Otherwise, returns false.
     *
     *  @param  p   the predicate to test
     */
    exists(p: (a: A) => boolean): boolean {
        return !this.isEmpty() && p(this.get());
    }

    // TODO: find good use cases
    /** Returns true if this option is empty '''or''' the predicate
     * $p returns true when applied to this $option's value.
     *
     *  @param  p   the predicate to test
     *
    forall(p: (a: A) => boolean): boolean{
        return this.isEmpty() || p(this.get());
    }*/

    /** Apply the given procedure $f to the option's value,
     *  if it is nonempty. Otherwise, do nothing.
     *
     *  @param  f   the procedure to apply.
     *  @see map
     *  @see flatMap
     */
    foreach<U>(f: (a: A) => U): void {
        if (!this.isEmpty()) f(this.get());
    }

    /** Returns this $option if it is nonempty,
     *  otherwise return the result of evaluating `alternative`.
     *  @param alternative the alternative expression.
     */
    orElse(alternative: Option<A>): Option<A> {
        if (this.isEmpty()) {
            return alternative;
        }
        return this;
    }

    equals(target: Option<A>): boolean {
        return (
            this.isDefined() && target.isDefined() && this.get() === target.get()
        ) || (this.isEmpty() && target.isEmpty());
    }
}

export class WithFilter<A> {
    constructor(
        private self: Option<A>, 
        private p: (a: A) => boolean) {
    }

    map<B>(f: (a: A) => B): Option<B> {
        return this.self.filter(this.p).map(f);
    }


    flatMap<B>(f: (a: A) => Option<B>): Option<B>{
        return this.self.filter(this.p).flatMap(f);
    }


    foreach<U>(f: (a: A) => U): void {
        this.self.filter(this.p).foreach(f);
    }


    withFilter(q: (a: A) => boolean): WithFilter<A> {
        return new WithFilter(this.self, _ => this.p(_) && q(_))
    }
}

export class TSome<A> extends Option<A>{
    constructor(private readonly x: A){
        super();
    }

    isEmpty(): boolean{
        return false;
    }

    get(): A {
        return this.x;
    }
}

export class TNone<A> extends Option<A>{
    isEmpty(): boolean{
        return true;
    }

    get(): A {
        throw new RangeError('none.get()');
    }
}

export const none = new TNone<any>();

export const some = <A>(x: A): Option<A> => {
    if(x === null || typeof x === 'undefined'){
        return none as Option<A>;
    }
    return new TSome(x);
}
