type Fn<A> = A | (<A>() => A);

export abstract class Option<A> {
    /** Returns true if the option is $none, false otherwise.
     */
    abstract isEmpty(): Boolean
    
    /** Returns true if the option is an instance of $some, false otherwise.
     */
    isDefined(): Boolean {
        return !this.isEmpty();
    }
    
    /** Returns the option's value.
     *  @note The option must be nonempty.
     *  @throws NoSuchElementException if the option is empty.
     */
    abstract get(): A
    
    /** Returns the option's value if the option is nonempty, otherwise
     * return the result of evaluating `default`.
     *
     *  @param default  the default expression.
     */
    getOrElse<B extends A>(dft: Fn<B>): A|B {
        if (this.isEmpty) {
            return typeof dft === 'function' ? dft(): dft;
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
    orNull(): A | null{
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
    map<B>(f: (a: A) => B): Option<B>{
        return this.isEmpty() ? None : Some<B>(f(this.get()))
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
    fold<B>(ifEmpty: () => B, f: (a: A) => B) {
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
        return this.isEmpty() ? None : f(this.get());
    }

    flatten(): A | TNone<A> {
        return this.isEmpty() ? None : this.get();
    }

    /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns true. Otherwise, return $none.
     *
     *  @param  p   the predicate used for testing.
     */
    filter(p: (a: A) => Boolean): Option<A>{
        return (this.isEmpty() || p(this.get())) ? this : None;
    }

    /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns false. Otherwise, return $none.
     *
     *  @param  p   the predicate used for testing.
     */
    filterNot(p: (a: A) => Boolean): Option<A>{
        return (this.isEmpty() || !p(this.get())) ? this : None;
    }

    /** Returns false if the option is $none, true otherwise.
     *  @note   Implemented here to avoid the implicit conversion to Iterable.
     */
    nonEmpty(): Boolean{
        return this.isDefined();
    }
}

class TSome<A> extends Option<A>{
    constructor(private readonly x: A){
        super();
    }

    isEmpty(): Boolean{
        return false;
    }

    get(): A {
        return this.x;
    }
}

class TNone<A> extends Option<A>{
    isEmpty(): Boolean{
        return true;
    }

    get(): A {
        throw new Error('None.get()');
    }
}

const None = new TNone<any>();

export const Some = <A>(x: A): Option<A> => {
    if(x === null || typeof x === 'undefined'){
        return None as Option<A>;
    }
    return new TSome(x);
}
