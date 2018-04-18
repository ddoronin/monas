import { expect } from 'chai';
import { Either, left, right } from './Either';

describe('Either examples', () => {
    describe('Example #1: input parser', () => {
        function tryParseInt(input: string): Either<string, number> {
            let n: number = parseInt(input, 10);
            return Either.cond(!isNaN(n), n, 'not a number');
        }

        it('should return `Right` if input has been parsed successfully', () => {
            let res = tryParseInt('42');
            expect(res).to.deep.eq(right(42));
        });

        it('should return `Left` with error message if input has been parsed with errors', () => {
            let res = tryParseInt('not a number');
            expect(res).to.deep.eq(left('not a number'));
        });
    });

    describe('Example #2: input validation', () => {
        const AGE_MIN = 14;
        const AGE_MAX = 30;

        function validateAge(input: string): Either<string, number> {
            try {
                let age: number = parseInt(input, 10);
                if(isNaN(age)){
                    throw new Error('Invalid input, the age should be a number.');
                }

                if(age < AGE_MIN || age > AGE_MAX){
                    throw new RangeError(`The age should be in range between ${AGE_MIN} and ${AGE_MAX}.`);
                }

                return right(age);
            } catch (e) {
                return left(e.message);
            }
        }

        it('should return `Right` with a valid age', () => {
            expect(validateAge('20')).to.deep.eq(right(20));
        });

        it('should return `Left` if age is not a number', () => {
            expect(validateAge('WAT')).to.deep.eq(left('Invalid input, the age should be a number.'));
        });

        it('should return `Left` if age is out of range', () => {
            expect(validateAge('10')).to.deep.eq(left(`The age should be in range between ${AGE_MIN} and ${AGE_MAX}.`));
        });
    });
});