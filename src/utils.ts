import { Option, Some } from './Option';

export function find<A>(array: A[], p: (a: A) => boolean): Option<A>{
    return Some(array.find(p));
}