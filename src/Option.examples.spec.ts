import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Option, Some, None } from './Option';
import { find } from './utils';

describe('Example #1: Let\'s find & map something', () => {
    describe('For given array of items find a word starting with "h" and capitalize it or return "N/A"', () => {
        let array = ['a', 'b', 'c', 'hello, world!'];

        describe('traditional way', () => {
            it('should return "Hello, World!"', () => {
                let word = array.find(_ => _.startsWith('h'));
                let res = 'N/A';
                if(word) {
                    res = word.toUpperCase();
                }
                expect(res).to.be.eq('HELLO, WORLD!');
            });
        });

        describe('with monads', () => {
            it('should return "Hello, World!"', () => {
                let word = array.find(_ => _.startsWith('h'));
                let res = Some(word).map(_ => _.toUpperCase()).getOrElse('N/A')
                expect(res).to.be.eq('HELLO, WORLD!');
            });
        });

        describe('or', () => {
            it('should return "Hello, World!"', () => {
                let res = find(array, _ => _.startsWith('h')).map(_ => _.toUpperCase()).getOrElse('N/A');
                expect(res).to.be.eq('HELLO, WORLD!');
            });
        });
    });
});
