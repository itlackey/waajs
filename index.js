const Game = require("./src/Game");
const exampleConfig = require("./test/ExampleGame.json");
const game = new Game(exampleConfig);
const inquirer = require("inquirer");

const continueQuestion = {
    type: "confirm",
    message: "Continue",
    name: "playing",
};
async function main() {
    game.init();

    result = game.startGame();

    result.currentTasks.forEach((t) => {
        console.log(t);
    });

    let c = { playing: true };
    while (c.playing && game.successCounter < 10 && game.failureCounter < 10 && game.currentRound < 10) {
        console.log("Starting round", game.currentRound);
        result = game.beginRound();
        game.currentTasks.forEach((t) => {
            console.log(t);
        });

        c = await inquirer.prompt(continueQuestion);

        console.log(c);
    }

    if (game.successCounter >= 10) {
        console.log("You win!");
    } else if (game.failureCounter >= 10) {
        console.log("You lose");
    }
}
main();
