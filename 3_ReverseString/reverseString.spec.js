const reverseString1 = require('./reverseString');

describe('reverseString', () => {
    test('reverses single word', () => {
        expect(reverseString1('hello')).toEqual('olleh');
    });
  
    test('reverses multiple words', () => {
        expect(reverseString1('hello there')).toEqual('ereht olleh');
    });
  
    test('works with numbers and punctuation', () => {
        expect(reverseString1('123! abc! Hello, Odinite.')).toEqual(
        '.etinidO ,olleH !cba !321'
        );
    });
    test('works with blank strings', () => {
        expect(reverseString1('')).toEqual('');
    });
});