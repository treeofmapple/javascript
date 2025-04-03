const {
    add,
    subtract,
    sum,
    multiply,
    power,
    factorial
} = require('./calculator');

VAL1 = 2 , VAL2 = 6, VAL3 = [7];
VAL4 = -10 , VAL5 = -4, VAL6 = [2,4];
VAL7 = 4, VAL8 = 3, VAL9 = 5;

console.log(add(VAL1, VAL2));
console.log(subtract(VAL4, VAL5));
console.log(sum(VAL3));
console.log(multiply(VAL6));
console.log(power(VAL7, VAL8));
console.log(factorial(VAL9));