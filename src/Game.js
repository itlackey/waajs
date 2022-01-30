const TaskSelector = require("./TaskSelector");
const { d6 } = require("./Dice");
const State = require('./State');
const Phases = {
    Tasks: 0,
    Logging: 1,
};

class Game {
    constructor(config, currentState = null) {
        this.config = config;
        this.state = new State(currentState);
        this.taskSelector = new TaskSelector(this.config.categories.flatMap((c) => c.tasks));
      
    }

    init() {
        
    }

    rollD6() {
        return d6();
    }
    startGame() {
        this.state.currentRound = 1;
        this.state.successCounter = 0;
        this.state.failureCounter = 100;
        this.state.currentPhase = Phases.Tasks;
        this.state.currentTasks = this.taskSelector.getTasksForFirstRound(this.config.difficulty);
        this.state.failureCounter = this.calculateFailureScore(this.state.failureCounter, this.state.currentTasks);
        this.state.previousTasks = [...this.state.currentTasks];
        return {
            currentTasks: this.state.currentTasks,
        };
    }

    beginRound() {
        let result = {
            successRoll: 0,
            failureScore: 0,
            currentTasks: [],
        };
        this.state.currentRound++;

        if (this.state.previousTasks.some((t) => t.id === "1.1")) {
            result.successRoll = this.rollD6();
            if (result.successRoll === 6) this.state.successCounter++;
        }

        if (this.taskSelector.availableTasks.length === 0) {
            this.state.successCounter = 10;
            this.state.currentTasks = [];
        } else {
            this.state.currentTasks = this.taskSelector.getTasksForRound();
            this.state.previousTasks = [...this.state.previousTasks, ...this.state.currentTasks];
        }

        if (this.state.successCounter === 10) {
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
