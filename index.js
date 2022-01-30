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
function getStatus() {
    console.log("");
    let failureMeter = "";
    let successMeter = "";
    for (let index = 0; index < game.state.failureCounter / 10; index++) {
        failureMeter += "🍀";
    }
    for (let index = 0; index < game.state.successCounter; index++) {
        successMeter += "⭐";
    }
    successMeter = successMeter || "😴";

    return `Progress: ${successMeter} | Luck: ${failureMeter} | Total Actions: ${game.state.previousTasks.length} / ${game.taskSelector.allTasks.length}\n`;
}

async function main(gamePath) {    
    const gameConfig = require(gamePath);
    await game.startGame(gameConfig);
    ui.updateBottomBar(getStatus());
    while (
        game.taskSelector.availableTasks.length > 0 &&
        game.state.successCounter < 10 &&
        game.state.failureCounter > 0
    ) {
        result = game.beginRound();
        console.log("Scene", game.state.currentRound);
        console.log("");

        for (let index = 0; index < result.currentTasks.length; index++) {
            const task = result.currentTasks[index];
            await inquirer.prompt(getJournalPrompt(task)).then((answer) => {
                task.journalEntry = {
                    id: task.id,
                    text: answer[task.id],
                };
            });
        }

        ui.updateBottomBar(getStatus());
        game.endRound(result.currentTasks.filter((t) => t.journalEntry).map((t) => t.journalEntry));
    }

    game.state.previousTasks.forEach((t) => {
        if (t.journalEntry) console.log(`${t.title}:`, t.journalEntry.text);
        else console.log(`${t.title}:`, "missing entry");
    });

    if (game.state.failureCounter <= 0) {
        console.log(game.config.lossMessage || "Ran out of luck this time...");
    } else if (game.state.successCounter >= 10) {
        console.log(game.config.winMessage || "Great success!");
    } else {
        console.log(game.config.drawMessage || "Right, we'll call it a draw");
    }
    console.log(`${game.state.successCounter * 10}% success | ${100 - game.state.failureCounter}% failure`);
}

main(process.argv[2] || "./test/ExampleGame.json");
