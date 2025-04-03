const { getTitle } = require('./get_titles');

const books = [
    {
        title: 'Cupcake',
        author: 'vandal'
    },
    {
        title: 'Mortis',
        author: 'Father_Garcia'
    }
]

console.log(getTitle(books));
