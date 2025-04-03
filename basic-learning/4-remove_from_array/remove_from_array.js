const removeFromArray = function(array, ...args) {
    const newArray = [];
    array.forEach((item) => {
        if(!args.includes){
            newArray.push(item);
        }
    });
    return newArray;
};

module.exports = removeFromArray;
