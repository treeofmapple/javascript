const convertToCelsius = function(value) {

    return Math.round((value - 32) * (5/9) * 10) / 10;
}

const convertToFahrenheit = function(value) {

    return Math.round(((value * 9) /5 + 32) * 10) /10;
}

module.exports = {
    convertToCelsius,
    convertToFahrenheit
};
