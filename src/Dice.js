function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    d6: () => getRandomNumber(1, 6),
    d20: () => getRandomNumber(1, 20),
    roll: (max) => getRandomNumber(1, max)
};
