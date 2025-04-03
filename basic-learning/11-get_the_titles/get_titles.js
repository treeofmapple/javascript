const getTitle = function(books){
    return books.map((book) => book.title);
}

module.exports = {
    getTitle
}