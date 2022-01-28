const TaskSelector = require("./TaskSelector");
const { d6 } = require("./Dice");
const Phases = {
    Tasks: 0,
    Logging: 1,
};

class Game {
    constructor(config, currentState = null) {
        this.config = config;
        this.taskSelector = new TaskSelector(this.config.categories.flatMap((c) => c.tasks));
        this.currentRound = -1;
        this.currentPhase = -1;
        this.successCounter = -1;
        this.failureCounter = -1;
        this.currentTasks = [];
        this.previousTasks = [];
    }

    init() {
        
    }

    rollD6() {
        return d6();
    }
    startGame() {
        this.currentRound = 1;
        this.successCounter = 0;
        this.failureCounter = 100;
        this.currentPhase = Phases.Tasks;
        this.currentTasks = this.taskSelector.getTasksForFirstRound(this.config.difficulty);
        this.failureCounter = this.calculateFailureScore(this.failureCounter, this.currentTasks);
        this.previousTasks = [...this.currentTasks];
        return {
            currentTasks: this.currentTasks,
        };
    }

    beginRound() {
        let result = {
            successRoll: 0,
            failureScore: 0,
            currentTasks: [],
        };
        this.currentRound++;

        if (this.previousTasks.some((t) => t.id === 1.1)) {
            result.successRoll = this.rollD6();
            if (result.successRoll === 6) this.successCounter++;
        }

        if (this.taskSelector.availableTasks.length === 0) {
            this.successCounter = 10;
            this.currentTasks = [];
        } else {
            this.currentTasks = this.taskSelector.getTasksForRound();
            this.previousTasks = [...this.previousTasks, ...this.currentTasks];
        }

        if (this.successCounter === 10) {
            //Final roll before winning
            this.failureCounter = this.calculateFailureScore(this.failureCounter, [
                {
                    failureScore: 1,
                },
            ]);
        } else {
            this.failureCounter = this.calculateFailureScore(this.failureCounter, this.currentTasks);
        }

        result.currentTasks = this.currentTasks;

        return result;
    }

    calculateFailureScore(currentCounter, currentTasks) {
        currentTasks
            .filter((t) => t.failureScore > 0)
            .forEach((t) => {
                for (let scoreIndex = 0; scoreIndex < t.failureScore; scoreIndex++) {
                    let score = 0;
                    for (let diceIndex = 0; diceIndex < currentCounter; diceIndex++) {
                        let number = this.rollD6();
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

    endRound() {}

    endGame() {}
}

module.exports = Game;
