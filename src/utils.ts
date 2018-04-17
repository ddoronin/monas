import { Option, some } from './Option';

export function find<A>(array: A[], p: (a: A) => boolean): Option<A>{
    return some(array.find(p));
}

export type FuncOrVal<A> = (() => A) | A;

export function funcOrVal<A>(f: FuncOrVal<A>): A {
    return (typeof f === 'function') ? f() : f;
}
