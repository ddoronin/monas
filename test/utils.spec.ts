import { expect } from 'chai';
import { find, funcOrVal, isFunction } from '../src/utils';

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
            expect(a.getOrElse(-1)).to.be.eq(4);
        });
    });

    describe('function funcOrVal<A, B>(f: FuncOrVal<A, B>): (a: A)', () => {
        it('should handle a constant value', () => {
            let f = funcOrVal<null, number>(42);
            expect(f(null)).to.be.eq(42);
        });

        it('should handle a func callback', () => {
            let f = funcOrVal<void, number>(() => 42 * 2);
            expect(f(void 0)).to.be.eq(84);
        });
    });

    describe('function isFunction<A, B>(f: ((a: A) => B) | B| A): f is (a: A) => B', () => {
        it('should return true if the callback is a function', () => {
            let isF = isFunction(() => 'test');
            expect(isF).to.be.true;
        });

        it('should return false if the callback is not a function', () => {
            let isF = isFunction('test');
            expect(isF).to.be.false;
        });
    });
});