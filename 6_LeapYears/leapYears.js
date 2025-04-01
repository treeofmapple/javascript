const leapYears = function(year) {

    const divisible = year % 4 === 0;
    const isCentury = year % 100 === 0;
    const hundred = year % 400 === 0;

    if(divisible && (!isCentury || hundred)){
        return true;
    } else {
        return false;
    }

}

module.exports = leapYears;