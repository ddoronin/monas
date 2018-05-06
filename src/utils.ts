import { Option, some } from './Option';

export function find<A>(array: A[], p: (a: A) => boolean): Option<A> {
    return some(array.find(p));
}

export type FuncOrVal<A, B> = ((a: A) => B) | B;

export function funcOrVal<A, B>(f: FuncOrVal<A, B>): (a: A) => B {
    return (a: A) => (typeof f === 'function' ? f(a) : f);
}
