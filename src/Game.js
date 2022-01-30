const State = require("./State");
const Phases = {
    Tasks: 0,
    Logging: 1,
};

class Game {
    constructor() {
        this.config = {};
        this.state = new State();
        this.taskSelector = null;
    }

    rollDice(max) {
        return Math.floor(Math.random() * (max - 2) + 1);
    }

    async startGame(config, currentState = null) {
        this.config = config;
        if (currentState) this.state = new State(currentState);
        else {
            this.state.currentRound = 0;
            this.state.successCounter = 0;
            this.state.failureCounter = 100;
        }
        const TaskSelector = require(config.taskSelector || "./TaskSelector");
        this.taskSelector = new TaskSelector(this.config.categories.flatMap((c) => c.tasks));
    }

    beginRound() {
        let result = {
            successRoll: 0,
            failureScore: 0,
            currentTasks: [],
        };
        this.state.currentRound++;
        this.state.currentPhase = Phases.Tasks;

        if (this.taskSelector.availableTasks.length === 0) {
            this.state.currentTasks = [];
        } else {
            if (this.state.currentRound === 1)
                this.state.currentTasks = this.taskSelector.getTasksForFirstRound(this.config.difficulty);
            else this.state.currentTasks = this.taskSelector.getTasksForRound();

            this.state.previousTasks = [...this.state.previousTasks, ...this.state.currentTasks];
        }

        result.successRoll = this.updateSuccessCounter(result);

        if (this.state.successCounter === 10 || this.state.currentTasks.length === 0) {
            //Final roll before winning
            this.state.failureCounter = this.calculateFailureScore(this.state.failureCounter, [
                {
                    failureScore: 1,
                },
            ]);
        } else {
            this.state.failureCounter = this.calculateFailureScore(this.state.failureCounter, this.state.currentTasks);
        }

        result.currentTasks = this.state.currentTasks;

        return result;
    }

    updateSuccessCounter() {
        if (
            this.state.currentTasks.some((t) => t.id === "1.1") ||
            this.state.previousTasks.some((t) => t.id === "1.1")
        ) {
            const result = this.rollDice(6);
            if (result === 6) this.state.successCounter++;
            return result;
        }
        return null;
    }

    endRound(journalEntries) {
        if (
            journalEntries == null &&
            this.state.currentTasks.some((t) => t.journalEntry == null || t.journalEntry.text == null)
        ) {
            throw new Error("No journal entries provided for this round");
        }
        if (!journalEntries || journalEntries.length !== this.state.currentTasks.length)
            throw new Error("Missing one or more journal entries");

        journalEntries.forEach((e) => {
            const i = this.state.currentTasks.findIndex((t) => t.id === e.id);
            this.state.currentTasks[i].journalEntry = e;
        });
    }

    endGame() {}

    calculateFailureScore(currentCounter, currentTasks) {
        currentTasks
            .filter((t) => t.failureScore > 0)
            .forEach((t) => {
                for (let scoreIndex = 0; scoreIndex < t.failureScore; scoreIndex++) {
                    let score = 0;
                    for (let diceIndex = 0; diceIndex < currentCounter; diceIndex++) {
                        let number = this.rollDice(6);
                        if (number === 1) {
                            score++;
                            if (score === currentCounter) break;
                        }
                    }
                    currentCounter = currentCounter - score;
                }
            });

        return currentCounter;
    }
}

module.exports = Game;
