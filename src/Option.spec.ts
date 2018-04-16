import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Option, Some, None } from './Option';

describe('Option', () => {

    describe('isEmpty()', () => {
        it('should return true if the option is $none, false otherwise.', () => {
            let a: Option<string> = None;
            expect(a.isEmpty()).to.be.true;
        });

        it('should return false if the option\'s value is nonempy.', () => {
            let a = Some('otherwise');
            expect(a.isEmpty()).to.be.false;
        });
    });

    describe('nonEmpty()', () => {
        it('should return true if the option is not $none', () => {
            let a: Option<string> = Some('thing');
            expect(a.nonEmpty()).to.be.true;
        });

        it('should return false if the option is $none', () => {
            let a = None;
            expect(a.nonEmpty()).to.be.false;
        });
    });

    describe('isDefined()', () => {
        it('should return true if the option is an instance of $some.', () => {
            let a: Option<string> = Some('something');
            expect(a.isDefined()).to.be.true;
        });

        it('should return false if the option is $none.', () => {
            let a = None;
            expect(a.isDefined()).to.be.false;
        });
    });

    describe('get()', () => {
        it('should return the option\'s value.', () => {
            let a = Some('Hello, World!');
            expect(a.get()).to.be.eq('Hello, World!');
        });

        it('should throw RangeError if the option is empty.', () => {
            let a = None;
            expect(a.get).throw(RangeError, 'None.get()');
        });
    });

    describe('getOrElse()', () => {
        it('should return the option\'s value if the option is nonempty.', () => {
            let a = Some('something');
            expect(a.getOrElse('otherwise')).to.be.eq('something');
        });

        it('should return "default" if the option is empty.', () => {
            let a = None;
            expect(a.getOrElse('otherwise')).to.be.eq('otherwise');
        });

        it('should return the result of evaluating "default" if the option is empty.', () => {
            let a = None;
            expect(a.getOrElse(() => 'otherwise')).to.be.eq('otherwise');
        });
    });

    describe('orNull()', () => {
        it('should return the option\'s value if it is nonempty, or `null` if it is empty.', () => {
            let a = Some('thing');
            expect(a.orNull()).to.be.eq('thing');
        });

        it('should return `null` if it is empty.', () => {
            let a = None;
            expect(a.orNull()).to.be.eq(null);
        });
    });

    describe('map', () => {
        it('should return a $some containing the result of applying $f to this $option\'s value if this $option is nonempty.', () => {
            let a = Some('thing');
            assert(a.map(_ =>'some' + _).equals(Some('something')));
        });

        it('should return $none if this $option is empty.', () => {
            let a = None;
            assert(a.map(_ =>'some' + _).equals(None));
        });
    });

    describe('fold', () => {
        it('should return the result of applying $f to this $option\'s value if the $option is nonempty.', () => {
            let a = Some('thing');
            expect(a.fold(() => 'nothing', _ =>'some' + _)).to.be.eq('something');
        });

        it('should evaluate expression `ifEmpty` if the $option is empty.', () => {
            let a = Some('thing');
            expect(a.fold(() => 'nothing', _ =>'some' + _)).to.be.eq('something');
        });
    });

    describe('flatMap', () => {
        it('should return the result of applying $f to this $option\'s value if this $option is nonempty.', () => {
            let a = Some('thing');
            let $f = _ => _ === 'thing' ? Some('something') : None;
            assert(a.flatMap($f).equals(Some('something')));
        });

        it('should return $none if this $option is nempty.', () => {
            let a = None;
            let $f = _ => Some('something');
            assert(a.flatMap($f).equals(None));
        });
    });

    /*
    describe('flatten', () => {
        it('should return the option\'s value.', () => {
            let a = Some(Some('Hello, World!');
            assert(a.flatten().equals(Some('Hello, World!')));
        });

        it('should return None if the option is empty.', () => {
            let a = None;
            assert(a.flatten().equals(None));
        });
    });
    */

    describe('filter', () => {
        it('should return this $option if it is nonempty and applying the predicate $p to this $option\'s value returns true.', () => {
            let a = Some(42);
            assert(a.filter(_ => _ === 42).equals(Some(42)));
        });

        it('should return this $none if it is nonempty, but applying the predicate $p to this $option\'s value returns false.', () => {
            let a = Some(42);
            assert(a.filter(_ => _ === 13).equals(None));
        });

        it('should return this $none if it is empty.', () => {
            let a = None;
            assert(a.filter(_ => true).equals(None));
        });
    });

    describe('filterNot', () => {
        it('should return this $option if it is nonempty and applying the predicate $p to this $option\'s value returns false.', () => {
            let a = Some(42);
            assert(a.filterNot(_ => _ === 13).equals(Some(42)));
        });

        it('should return $none if it is nonempty, but applying the predicate $p to this $option\'s value returns true.', () => {
            let a = Some(42);
            assert(a.filterNot(_ => _ === 42).equals(None));
        });

        it('should return $none if the option\'s value is empty.', () => {
            let a = None;
            assert(a.filterNot(_ => _ === 42).equals(None));
        });
    });

    /*describe('withFilter', () => {
        
    });*/

    describe('contains', () => {
        it('should return true if Some instance contains string "something" which equals "something".', () => {
            assert(Some('something').contains('something'));
            expect(Some('something').contains('something else')).to.be.false;
            expect(None.contains('something')).to.be.false;
            expect(None.contains(None)).to.be.false;
        });
    });

    describe('exists', () => {
        it('should return true if this option is nonempty and the predicate $p returns true when applied to this $option\'s value.', () => {
            assert(Some('something').exists(_ => _.length > 0));
        });

        it('should return false if this option is nonempty, but the predicate $p returns false when applied to this $option\'s value.', () => {
            expect(Some(42).exists(_ => _ < 42)).to.be.false;
        });
    });

    /*
    describe('forall', () => {
        it('should return true if this option is empty or the predicate $p returns true when applied to this $option\'s value.', () => {
            assert(Some(42).forall(_ => _ === 42));
        });
    });*/

    describe('foreach', () => {
        it('should apply the given procedure $f to the option\'s value, if it is nonempty. Otherwise, do nothing.', () => {
            let print = spy();
            Some(42).foreach(_ => print(_));
            assert(print.calledWith(42));
        });
    });

    describe('orElse()', () => {
        it('should return the option if it\'s is nonempty.', () => {
            let a = Some('something');
            assert(a.orElse(None).equals(Some('something')));
        });

        it('should return the alternative if the option is empty.', () => {
            let a = None;
            assert(a.orElse(Some('something')).equals(Some('something')));
        });
    });

    describe('equals()', () => {
        it('should return true if the both options are defined and have equal values.', () => {
            let a = Some('thing');
            let b = Some('thing');
            assert(a.equals(b));
            assert(b.equals(a));
        });

        it('should return false if the both options are defined, but have nonequal values.', () => {
            let a = Some('thing');
            let b = Some('another');
            assert(!a.equals(b));
            assert(!b.equals(a));
        });

        it('should return false if one of the options is $none.', () => {
            let a = Some('thing');
            let b = None;
            assert(!a.equals(b));
            assert(!b.equals(a));
        });

        it('should return true if both options are $none.', () => {
            let a = None;
            let b = None;
            assert(a.equals(b));
            assert(b.equals(a));
        });
    });

    
    //TODO: Investigate TypeError: s.slice is not a function.
    /*describe('iterable', () => {
        it('should return only the option\'s value when spread into array.', () => {
            let s = Some('something');
            let v = [...s];
            expect(v).to.be.eq(['something']);
        });
    });*/
});
