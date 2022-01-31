class State {
    constructor(currentState = null) {
        if (currentState == null) {
            this.currentRound = -1;
            this.currentPhase = -1;
            this.successCounterActive = false;
            this.successBonusActive = false;
            this.successCounter = -1;
            this.primaryFailureCounter = -1;
            this.secondaryFailureCounter = -1;
            this.currentTasks = [];
            this.previousTasks = [];
            this.availableTasks = [];
        } else {
            Object.assign(this, currentState);
        }
    }  
}

module.exports = State;
