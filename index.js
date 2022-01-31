const inquirer = require("inquirer");
const BottomBar = require("inquirer/lib/ui/bottom-bar");
const ui = new BottomBar({ bottomBar: "Establishing connection...\n" });
const Game = require("./src/Game");
const game = new Game();

let primaryFailureIcon = "🍀";
let successCounterIcon = "⭐";
let secondaryFailureIcon = "👻";

function getStatusOutput() {
    //console.log("");
    let failureMeter = "";
    let successMeter = "";
    let secondaryFailureMeter = "";

    for (let index = 0; index < game.state.successCounter; index++) {
        successMeter += successCounterIcon;
    }
    for (let index = 0; index < game.state.primaryFailureCounter / 10; index++) {
        failureMeter += primaryFailureIcon;
    }
    for (let index = 0; index < game.state.secondaryFailureCounter; index++) {
        secondaryFailureMeter += secondaryFailureIcon;
    }
    successMeter = successMeter || "😴";

    let status =
        `Progress: ${successMeter} | Luck: ${failureMeter} | Failure: ${secondaryFailureMeter} | ` +
        `Total Actions: ${game.state.completedTasks.length} / ${game.taskSelector.allTasks.length}\n`;

    // status =
    //     `Progress: ${game.state.successCounter} | Luck: ${game.state.primaryFailureCounter} | Failure: ${game.state.secondaryFailureCounter} | ` +
    //     `Current Actions: ${game.state.currentTasks.length} | Total Actions: ${game.state.completedTasks.length} / ${game.taskSelector.allTasks.length}\n`;

    return status;
}
function displayFinalOutput() {
    for (let index = 1; index <= game.state.currentRound; index++) {
        console.log("============ROUND==============");
        console.log("Round", index);
        let tasks = game.state.completedTasks.filter((t) => t.roundCompleted === index);
        tasks.forEach((t) => {
            console.log(t.title);
        });

        console.log("===========JOURNAL=============");
        let entries = game.state.journalEntries.filter((e) => e.round == index);
        entries.forEach((e) => {
            console.log(e.text);
        });
    }

    console.log("===============================");
    if (game.state.primaryFailureCounter <= 0) {
        console.log(game.config.primaryFailureMessage || "Ran out of luck this time...");
    } else if (game.state.secondaryFailureCounter >= 4) {
        console.log(game.config.secondaryFailureMessage || "You fail!");
    } else if (game.state.successCounter >= 10) {
        console.log(game.config.successMessage || "Great success!");
    } else {
        console.log(game.config.drawMessage || "Right, we'll call it a draw");
    }
    console.log(`${game.state.successCounter * 10}% success | ${100 - game.state.primaryFailureCounter}% failure`);
    ui.updateBottomBar(getStatusOutput());
}

async function main(gamePath) {
    const gameConfig = require(gamePath);

    if (gameConfig.cli) {
        primaryFailureIcon = gameConfig.cli.primaryFailureIcon || primaryFailureIcon;
        secondaryFailureIcon = gameConfig.cli.secondaryFailureIcon || secondaryFailureIcon;
        successCounterIcon = gameConfig.cli.successCounterIcon || successCounterIcon;
    }

    await game.startGame(gameConfig);

    ui.updateBottomBar(getStatusOutput());
    while (
        game.state.availableTasks.length > 0 &&
        game.state.successCounter < 10 &&
        game.state.primaryFailureCounter > 0 &&
        game.state.secondaryFailureCounter < 4
    ) {
        await game.beginRound();

        ui.updateBottomBar(getStatusOutput());
        for (let index = 0; index < game.state.currentTasks.length; index++) {
            const task = game.state.currentTasks[index];
            console.log("Task", task.id, ":", task.title);
        }

        let entry = {};
        await inquirer
            .prompt({
                type: "input",
                name: game.state.currentRound,
                message: `Record your journal`,
                validate: (input) => {
                    if (!input) return "Required";
                    return true;
                },
            })
            .then((answer) => {
                entry = {
                    round: game.state.currentRound,
                    text: answer[game.state.currentRound],
                };
            });

        game.endRound(entry);
        ui.updateBottomBar(getStatusOutput());
    }

    game.endGame();

    displayFinalOutput();
}

main(process.argv[2] || "./games/ExampleGame.json");
