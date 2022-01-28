const Game = require("./src/Game");
const inquirer = require("inquirer");
const BottomBar = require("inquirer/lib/ui/bottom-bar");
const ui = new BottomBar({ bottomBar: "Establishing connection...\n" });
const continueQuestion = {
    type: "confirm",
    message: "Continue",
    name: "playing",
};

let gamePath = process.argv[2] || "./test/ExampleGame.json";
const exampleConfig = require(gamePath);
const game = new Game(exampleConfig);

function getStatus() {
    console.log("");
    let failureMeter = "";
    let successMeter = "";
    for (let index = 0; index < game.failureCounter / 10; index++) {
        failureMeter += "🍀";
    }
    for (let index = 0; index < game.successCounter; index++) {
        successMeter += "⭐";
    }
    successMeter = successMeter || "😴";

    return `Progress: ${successMeter} | Luck: ${failureMeter} | Total Actions: ${game.previousTasks.length} / ${game.taskSelector.allTasks.length}\n`;
}

async function main() {
    game.init();

    result = game.startGame();

    console.log("Scene", game.currentRound);
    console.log(game.currentTasks.length, `Actions:`);
    console.log(result.currentTasks.map((t) => "\t" + t.title).join("\n"));
    ui.updateBottomBar(getStatus());
    let c = await inquirer.prompt(continueQuestion);

    while (c.playing && game.successCounter < 10 && game.failureCounter > 0) {
        result = game.beginRound();
        console.log("Scene", game.currentRound);
        console.log(game.currentTasks.length, `Actions:`);
        console.log(result.currentTasks.map((t) => "\t" + t.title).join("\n"));
        ui.updateBottomBar(getStatus());
        game.endRound();
        if (game.failureCounter <= 0 || game.successCounter >= 10) c = { playing: false };
        else c = await inquirer.prompt(continueQuestion);
    }


    if (game.failureCounter <= 0) {
        console.log("You lose");
    } else if (game.successCounter >= 10) {
        console.log("You win");
    } else {
        console.log("We'll call it a draw");
    }
    console.log(`Scores: ${game.successCounter} | ${game.failureCounter}`);
}
main();
