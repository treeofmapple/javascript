const repeatString = require('./repeatString');

describe('repeatString', () => {
    
    //
    test('Repeats the string', () => {
        expect(repeatString('hey', 3)).toEqual('heyheyhey');
    });

    //
    test('Repeats the String many times', () => {
        expect(repeatString('hello', 10)).toEqual('hellohellohellohellohellohellohellohellohellohello')
    });

    //
    test('repeats the string 1 times', () => {
        expect(repeatString('hi', 1)).toEqual('hi');
    });

    //
    test('repeats the string 0 times', () => {
        expect(repeatString('bye', 0)).toEqual('');
    });

    //
    test('does not use the built-in String repeat method', () => {
        jest.spyOn(String.prototype, 'repeat').mockName('Built-in String repeat method');
        repeatString("don't use the built-in repeat method!", 1);
        expect(String.prototype.repeat).not.toHaveBeenCalled();
    });

    //
    test('returns ERROR with negative numbers', () => {
        expect(repeatString('goodbye', -1)).toEqual('ERROR');
    });

    //
    test('repeats the string a random amount of times', function () {
        const number = Math.floor(Math.random() * 1000);
        expect(repeatString('hey', number)).toBe('hey'.repeat(number));
    });

    //
    test('works with blank strings', () => {
        expect(repeatString('', 10)).toEqual('');
    });

});
