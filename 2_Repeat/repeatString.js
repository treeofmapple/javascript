const repeatString = function(string, REPEAT) {

    if(REPEAT < 0) return 'ERROR';

    let data = '';

    for(let i = 0; i < REPEAT; i++) {
        data += string;
    }
    return data;
}

module.exports = repeatString;