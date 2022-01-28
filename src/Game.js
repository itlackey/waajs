const TaskSelector = require("./TaskSelector");
const { d6, d20 } = require("./Dice");
const Phases = {
    Tasks: 0,
    Logging: 1,
};

class Game {
    constructor(config, currentState = null) {
        this.config = config;
        this.difficulty = 0;
        this.currentRound = -1;
        this.currentPhase = -1;
        this.successCounter = -1;
        this.failureCounter = -1;
        this.taskSelector = new TaskSelector(config);
        this.currentTasks = [];
    }

    init() {
        this.currentRound = 1;
        this.successCounter = 0;
        this.failureCounter = d6();
        this.currentPhase = Phases.Tasks;
    }

    startGame() {
        this.currentTasks = this.taskSelector.getTasksForFirstRound(this.config.difficulty);

        return {
            currentTasks: this.currentTasks,
        };
    }

    beginRound() {
        this.currentRound++;
        this.currentTasks = this.taskSelector.getTasksForRound();
        this.currentTasks.forEach(t => {
            this.failureCounter += t.failureScore;
        });
        return {
            currentTasks: this.currentTasks,
        };
    }

    endRound() {
        if (this.taskSelector.availableTasks.length === 0) {
            this.successCounter = 10;
            this.endGame();
        }
    }

    endGame() {

    }
}

module.exports = Game;
