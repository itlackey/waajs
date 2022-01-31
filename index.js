const inquirer = require("inquirer");
const BottomBar = require("inquirer/lib/ui/bottom-bar");
const ui = new BottomBar({ bottomBar: "Establishing connection...\n" });
const Game = require("./src/Game");
const game = new Game();

function getJournalPrompt(task) {
    return {
        type: "input",
        name: task.id,
        message: task.title,
        validate: (input) => {
            if (!input) return "Required";
            return true;
        },
    };
}
let primaryFailureIcon = "🍀";
let successCounterIcon = "⭐";
let secondaryFailureIcon = "👻";
function getStatus() {
    console.log("");
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

    return (
        `Progress: ${successMeter} | Luck: ${failureMeter} | Failure: ${secondaryFailureMeter} | ` +
        `Total Actions: ${game.state.previousTasks.length} / ${game.taskSelector.allTasks.length}\n`
    );
}

async function main(gamePath) {
    const gameConfig = require(gamePath);
    await game.startGame(gameConfig);

    if (gameConfig.cli) {
        primaryFailureIcon = gameConfig.cli.primaryFailureIcon || primaryFailureIcon;
        secondaryFailureIcon = gameConfig.cli.secondaryFailureIcon || secondaryFailureIcon;
        successCounterIcon = gameConfig.cli.successCounterIcon || successCounterIcon;
    }
    ui.updateBottomBar(getStatus());
    while (
        game.taskSelector.availableTasks.length > 0 &&
        game.state.successCounter < 10 &&
        game.state.primaryFailureCounter > 0 &&
        game.state.secondaryFailureCounter < 4
    ) {
        await game.beginRound();
        // console.log("Scene", game.state.currentRound);
        // console.log("");

        //ui.updateBottomBar(getStatus());
        for (let index = 0; index < game.state.currentTasks.length; index++) {
            const task = game.state.currentTasks[index];

            await inquirer.prompt(getJournalPrompt(task)).then((answer) => {
                task.journalEntry = {
                    id: task.id,
                    text: answer[task.id],
                };
            });
        }
        game.endRound(game.state.currentTasks.filter((t) => t.journalEntry).map((t) => t.journalEntry));
        ui.updateBottomBar(getStatus());
    }

    game.state.previousTasks.forEach((t) => {
        if (t.journalEntry) console.log(`${t.title}:`, t.journalEntry.text);
        else console.log(`${t.title}:`, "missing entry");
    });

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
    ui.updateBottomBar(getStatus());
}

main(process.argv[2] || "./test/ExampleGame.json");
