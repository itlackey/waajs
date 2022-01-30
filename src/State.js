class State {
    constructor(currentState = null) {
        if (currentState != null) {
            this.currentRound = currentState.currentRound;
            this.currentPhase = currentState.currentPhase;
            this.successCounter = currentState.successCounter;
            this.failureCounter = currentState.failureCounter;
            this.currentTasks = currentState.currentTasks;
            this.previousTasks = currentState.previousTasks;
        } else {
            this.currentRound = -1;
            this.currentPhase = -1;
            this.successCounter = -1;
            this.failureCounter = -1;
            this.currentTasks = [];
            this.previousTasks = [];
        }
    }
}

module.exports = State;
