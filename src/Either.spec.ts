import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Either, left, right } from './Either';
import { none, some } from './Option';

describe('Either', () => {

    describe('Either.cond()', () => {
        it('should return the given `B` in `Right` if the condition is satisfied.', () => {
            let result = Either.cond(true, 42, 13);
            expect(result).to.be.deep.eq(right(42));
        });

        it('should return the given `A` in `Left` if the condition is not satisfied.', () => {
            let result = Either.cond(false, 42, 13);
            expect(result).to.be.deep.eq(left(13));
        });
    });

    describe('fold', () => {
        it('should apply `fa` if this is a `Left`.', () => {
            expect(left<number, number>(13).fold(_ => _ + 10, _ => _ - 10)).to.be.eq(23);
        });

        it('should apply `fb` if this is a `Right`.', () => {
            expect(right<number, number>(42).fold(_ => _ + 10, _ => _ - 10)).to.be.eq(32);
        });
    });

    describe('swap', () => {
        it('should return the left value in `Right`.', () => {
            let l: Either<string, number>  = left('left');
            expect(l.swap()).to.be.deep.eq(right<number, string> ('left'));
        });

        it('should return the right value in `Left`.', () => {
            let r: Either<string, number>  = right(42);
            expect(r.swap()).to.be.deep.eq(left<number, string> (42));
        });
    });

    describe('foreach', () => {
        it('should execute the given side-effecting function if this is a `Right`.', () => {
            let print = spy();
            right(42).foreach(_ => print(_));
            assert(print.calledWith(42));
        });

        it('should not execute the given side-effecting function if this is a `Left`.', () => {
            let print = spy();
            left(42).foreach(_ => print(_));
            assert(print.notCalled);
        });
    });

    describe('getOrElse', () => {
        it('should return the value from this `Right`.', () => {
            expect(right(42).getOrElse(13)).to.be.eq(42);
        });

        it('should return an alternative value if this is `Left`.', () => {
            expect(left(42).getOrElse(13)).to.be.eq(13);
        });
    });

    describe('contains', () => {
        it('should return `true` if this is a `Right` and its value is equal to `elem`.', () => {
            assert(right(42).contains(42));
            assert(!right(42).contains(12));
            assert(!left(42).contains(42));
        });
    });

    describe('exists', () => {
        it('should return `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.', () => {
            assert(right(12).exists(_ => _ > 10));
            assert(!right(7).exists(_ => _ > 10));
            assert(!left(42).exists(() => true));
        });
    });

    describe('map', () => {
        it('should apply the given function if this is a `Right`.', () => {
            expect(right('hello').map(_ => _ + ' world!')).to.be.deep.eq(right('hello world!'));
        });

        it('should not apply the given function if this is a `Left`.', () => {
            expect(left('hello').map(_ => _ + ' world!')).to.be.deep.eq(left('hello'));
        });
    });

    describe('filterOrElse', () => {
        it('should returns `Right` with the existing value of `Right` if this is a `Right` and the given predicate `p` holds for the right value.', () => {
            let res = right(12).filterOrElse(_ => _ > 10, -1);
            expect(res).to.be.deep.eq(right(12));
        });

        it('should returns `Left(zero)` if this is a `Right` and the given predicate `p` does not hold for the right value.', () => {
            let res = right(12).filterOrElse(_ => _ < 10, -1);
            expect(res).to.be.deep.eq(left(-1));
        });

        it('should returns `Left` with the existing value of `Left` if this is a `Left`.', () => {
            let res = left(12).filterOrElse(_ => _ > 10, -1);
            expect(res).to.be.deep.eq(left(12));
        });
    });

    describe('toOption', () => {
        it('should return a `Some` containing the `Right` value if it exists.', () => {
            let opt = right('hello').toOption();
            expect(opt).to.be.deep.eq(some('hello'));
        });

        it('should return a `None` if this is a `Left`.', () => {
            let opt = left('hello').toOption();
            expect(opt).to.be.eq(none);
        });
    });
});