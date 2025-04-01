const calculator = require('./calculator');

VAL1 = 2 , VAL2 = 6, VAL3 = [7];
VAL4 = -10 , VAL5 = -4, VAL6 = [2,4];
VAL7 = 4, VAL8 = 3, VAL9 = 5;

console.log(calculator.add(VAL1, VAL2));
console.log(calculator.subtract(VAL4, VAL5));
console.log(calculator.sum(VAL3));
console.log(calculator.multiply(VAL6));
console.log(calculator.power(VAL7, VAL8));
console.log(calculator.factorial(VAL9));