const { getTitle } = require('./get_titles');

// 
describe('getTheTitles', () => {
    const books = [
    {
        title: 'Book',
        author: 'Name',
    },
    {
        title: 'Book2',
        author: 'Name2',
    },
    ];

    test('gets titles', () => {
        expect(getTitle(books)).toEqual(['Book', 'Book2']);
    });
    
});