console.log('1-swapping-variables');

let value1 = 'one';
let value2 = 'two';

console.log('original', value1);
console.log('original', value2);

let value3 = value1;
value1 = value2;
value2 = value3;

console.log('swap', value1);
console.log('swap', value2);
