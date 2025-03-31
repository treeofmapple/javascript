const reverseString2 = function(string) {

    var split = string.split("");

    var reverse = split.reverse();

    var join = reverse.join("");
    
    return join;
}

const reverseString1 = function(string) {
    return string.split("").reverse().join("");
}

module.exports = reverseString1;
module.exports = reverseString2;