const add = function(num1, num2) {
	return num1 + num2;
};

const subtract = function(num1, num2) {
	return num1 - num2;
};

const sum = function(array) {
	return array.reduce((total, current) => total + current, 0);
};

const multiply = function(array) {
    return array.reduce((product, current) => product * current);
};

const power = function(num1, num2) {
	return Math.pow(num1, num2);
};

const factorial = function(num1) {
    let product = 1;
    for(let i = num1; i > 0; i--) {
        product *= i;
    }
    return product;
};

module.exports = {
  add, subtract, sum, multiply, power, factorial
};