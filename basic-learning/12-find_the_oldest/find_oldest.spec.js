import { test, expect } from '@playwright/test';
const { findOldie } = require('./find_oldest');

test.describe('findTheOldest', () => {

    //
    test('finds the person with the greatest age!', async () => {
        const people = [
            { name: "Carly", yearOfBirth: 1942, yearOfDeath: 1970 },
            { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 },
            { name: "Jane", yearOfBirth: 1912, yearOfDeath: 1941 },
        ];
        expect(findOldie(people).name).toBe('Ray');
    });

    //
    test('finds the oldest person if yearOfDeath field is undefined on a non-oldest person', async () => {
        const people = [
            { name: "Carly", yearOfBirth: 2018 },
            { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 },
            { name: "Jane", yearOfBirth: 1912, yearOfDeath: 1941 },
        ];
        expect(findOldie(people).name).toBe('Ray');
    });

    //
    test('finds the oldest person if yearOfDeath field is undefined for the oldest person', async () => {
        const people = [
            { name: "Carly", yearOfBirth: 1066 },
            { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 },
            { name: "Jane", yearOfBirth: 1912, yearOfDeath: 1941 },
        ];
        expect(findOldie(people).name).toBe('Carly');
    });

});