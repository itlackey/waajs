const inquirer = require("inquirer");
const BottomBar = require("inquirer/lib/ui/bottom-bar");
const ui = new BottomBar({ bottomBar: "Establishing connection...\n" });
const Game = require("../src/Game");
const game = new Game();

let primaryFailureIcon = "🍀";
let successCounterIcon = "⭐";
let secondaryFailureIcon = "👻";

function getStatusOutput() {
    if (!game.config.cli) game.config.cli = {};

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
    successMeter = successMeter || "\t";

    let status =
        `${game.config.cli.successCounterLabel || "Progress"}: ${successMeter} | ` +
        `${game.config.cli.secondaryFailureLabel || "Failure"}: ${secondaryFailureMeter || "\t"} | ` +
        `${game.config.cli.primaryFailureLabel || "Luck"}: ${failureMeter}\n`; // +
    //`Total Actions: ${game.state.completedTasks.length} / ${game.taskSelector.allTasks.length}\n`;

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
    const gameConfig = require(process.cwd() + "/" + gamePath);

    if (gameConfig.cli) {
        primaryFailureIcon = gameConfig.cli.primaryFailureIcon || primaryFailureIcon;
        secondaryFailureIcon = gameConfig.cli.secondaryFailureIcon || secondaryFailureIcon;
        successCounterIcon = gameConfig.cli.successCounterIcon || successCounterIcon;
    }

    if (gameConfig.safety) {
        console.log("=============SAFTEY=============");
        console.log(gameConfig.safety);
        console.log("================================");
        console.log();
    }

    if (gameConfig.who) {
        console.log("=============WHO=============");
        console.log(gameConfig.who);
        console.log("================================");
        console.log();
    }

    if (gameConfig.what) {
        console.log("=============WHAT=============");
        console.log(gameConfig.what);
        console.log("================================");
        console.log();
    }

    if (gameConfig.how) {
        console.log("=============HOW=============");
        console.log(gameConfig.how);
        console.log("================================");
        console.log();
    }

    if (gameConfig.begin) {
        console.log(gameConfig.begin);
        //ToDo: record first journal entry
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
        console.log("Day", game.state.currentRound);
        for (let index = 0; index < game.state.currentTasks.length; index++) {
            const task = game.state.currentTasks[index];
            console.log("  * " + task.title);
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

main(process.argv[2] || "games/ExampleGame.json");
