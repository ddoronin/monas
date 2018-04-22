import { expect } from 'chai';
import { find, funcOrVal } from './utils';

describe('utils', () => {
    describe('find<A>(array: A[], p: (a: A) => boolean): Option<A>', () => {
        it('should return $none if nothing has been found', () => {
            let arr = [1, 2, 3, 4, 5];
            let a = find(arr, _ => _ === 6);
            expect(a.isEmpty()).to.be.true;
        });

        it('should return $some if something\'s been found', () => {
            let arr = [1, 2, 3, 4, 5];
            let a = find(arr, _ => _ === 4);
            expect(a.get()).to.be.eq(4);
        });
    });

    describe('function funcOrVal<A>(f: FuncOrVal<A>): A', () => {
        it('should handle a constant value', () => {
            let f = funcOrVal<number>(42);
            expect(f).to.be.eq(42);
        });

        it('should handle a func callback', () => {
            let f = funcOrVal<number>(() => 42 * 2);
            expect(f).to.be.eq(84);
        });
    });
});