import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Option, none, some} from './Option';

describe('Use cases', () => {
    describe('Example #1: Country code lookup', () => {
        type Country = {name: string, code: number};
        let countries: Country[] = [{
            name: 'United States',
            code: 1
        }, {
            name: 'United Kingdom',
            code: 44
        }];

        describe('traditional way', () => {

            // Traditionally we would try to find an item,
            // check if it's not null or undefined and than
            // get a property name.
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

            // Using option the step checking on null or undefined
            // can be completely eliminated!
            function findCountryName(code: number): string {
                // no changes here
                const country = countries.find(c => c.code === code);

                // wrap a nullable item with an Option<A> using function `some()`
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

    describe('Example #2: Users repository', () => {
        class Repository<T> {
            constructor(private readonly collection: T[]) {
            }

            find<K extends keyof T>(key: K, val: any): Option<T> {
                return some(this.collection.find(_ => _[key] === val));
            }
        }

        class Profile {
            constructor(
                public firstName: string,
                public lastName: string,
                public skill: Option<string> = none
            ) {
            }
        }

        const greatFolksRepo = new Repository<Profile>([
            new Profile('John', 'Lennon', some('Guitars')),
            new Profile('Paul', 'McCartney', some('Lead Vocals')),
            new Profile('George', 'Harrison', some('Lead guitar')),
            new Profile('Ringo', 'Starr', some('Drums'))
        ]);

        class Album {
            constructor(
                public title: string,
                public year: number,
                public author: string
            ) {
            }
        }

        const greatMusicRepo = new Repository<Album>([
            new Album('Ram', 197, 'Paul McCartney',)
        ]);

        it('should find John Lennon skill', () => {
            let skill = greatFolksRepo.find('firstName', 'John').flatMap(_ => _.skill);
            expect(skill).to.be.deep.eq(some('Guitars'));
        });

        it('should gracefully handle not found person', () => {
            let skill = greatFolksRepo.find('firstName', 'Dima').flatMap(_ => _.skill);
            expect(skill).to.be.deep.eq(none);
        });

        it('should gracefully resolve options using `for` and do find a person and his great albums', () => {
            const findAlbum = (firstName: string): string | undefined => {
                for (let folk of greatFolksRepo.find('firstName', firstName)) {
                    let fullName = `${folk.firstName} ${folk.lastName}`;
                    for (let album of greatMusicRepo.find('author', fullName)) {
                        return album.title;
                    }
                }
            };

            expect(findAlbum('Paul')).to.be.eq('Ram');
            expect(findAlbum('Ringo')).to.be.undefined;
        });
    });
});
