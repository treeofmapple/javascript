const getAge = function(birth, death){

    if(!death) {
        death = new Date().getFullYear();
    }

    return death - birth;

}

const findOldie = function(people) {
    return people.reduce((oldest, currentPerson) => {
        const oldestAge = getAge(oldest.yearOfBirth, oldest.yearOfDeath);
        const currentAge = getAge(
            currentPerson.yearOfBirth,
            currentPerson.yearOfDeath
        );
        
        return oldestAge < currentAge ? currentPerson : oldest;
    });
};

module.exports = {
    findOldie

};