import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Option, some, none } from './Option';
import { find } from './utils';

describe('Example #1: Let\'s find & map something', () => {
    describe('For given array of items find a word starting with "h" and capitalize it or return "N/A"', () => {
        let array = ['a', 'b', 'c', 'hello, world!'];

        describe('traditional way', () => {
            it('should return "Hello, World!"', () => {
                let word = array.find(_ => _.startsWith('h'));
                let res = word && word.toUpperCase() || 'N/A';
                expect(res).to.be.eq('HELLO, WORLD!');
            });
        });

        describe('with monads', () => {
            it('should return "HEllo, World!"', () => {
                let word = array.find(_ => _.startsWith('h'));
                let res = some(word).map(_ => _.toUpperCase()).getOrElse('N/A')
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
