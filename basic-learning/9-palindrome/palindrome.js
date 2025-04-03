const palindromes = function (variable) {

    const alphanum = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const clean = variable
        .toLowerCase()
        .split('')
        .filter((character) => alphanum.includes(character))
        .join('');

    const reverse = clean.split('').reverse().join('');

    return clean == reverse;
};

module.exports = {
    palindromes
};