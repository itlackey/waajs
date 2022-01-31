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
        this.PrimaryFailureCheck = require("./Actions/PrimaryFailureCheck");
        this.SuccessCheck = require('./Actions/SuccessCheck');
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
            this.state.primaryFailureCounter = 100;
            this.state.secondaryFailureCounter = 0;
        }
        const TaskSelector = require(config.taskSelector || "./TaskSelector");
        this.taskSelector = new TaskSelector(this.config.categories.flatMap((c) => c.tasks));
    }

    async beginRound() {
        
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

        if (this.state.successCounter === 10 || this.state.currentTasks.length === 0) {
            //Final roll before winning
            this.PrimaryFailureCheck.run(this.state);
        }

     
        for (let index = 0; index < this.state.currentTasks.length; index++) {
            const task = this.state.currentTasks[index];

            if (typeof task.action === "string") {
                try {
                    task.action = require("./Actions/" + task.action);
                } catch (error) {
                    console.error(error);
                    try {
                        task.action = require(task.action);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            if (typeof task.action === "function") task.action(this.state);
            else if (typeof task.action === "object" && typeof task.action.run === "function")
                task.action.run(this.state);
        }
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
       
        this.SuccessCheck.run(this.state);
    }

    endGame() {}
}

module.exports = Game;
