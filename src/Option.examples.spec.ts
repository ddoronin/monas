import { expect } from 'chai';
import { some } from './Option';

describe('Use cases', () => {
    describe(' Example #1: Country code lookup', () => {
        type Country = {name: string, code: number};
        let countries: Country[] = [{
            name: 'United States',
            code: 1
        }, {
            name: 'United Kingdom',
            code: 44
        }];

        describe('traditional way', () => {
            function findCountryName(code: number): string {
                const country = countries.find(c => c.code === code);
                if (country) {
                    return country.name;
                }
                return 'Not found';
            }

            it('should return USA when search for code 1', () => {
                expect(findCountryName(1)).to.be.eq('United States');
            });

            it('should return "Not found" when search for code -123', () => {
                expect(findCountryName(-123)).to.be.eq('Not found');
            });
        });

        describe('functional way', () => {
            function findCountryName(code: number): string {
                const country = countries.find(c => c.code === code);
                return some(country).map(_ => _.name).getOrElse('Not found');
            }

            it('should return USA when search for code 1', () => {
                expect(findCountryName(1)).to.be.eq('United States');
            });

            it('should return "Not found" when search for code -123', () => {
                expect(findCountryName(-123)).to.be.eq('Not found');
            });
        });
    });
});
