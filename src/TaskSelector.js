const { d6, d20, roll } = require("./Dice");
//ToDo: rename to "Deck"
//ToDo: use game state for available tasks
class TaskSelector {
    constructor(config, state) {
        this.config = config;
        this.state = state;
        this.allTasks =  [...this.config.categories.flatMap((c) => c.tasks)];

        if(this.state.availableTasks == null){
            this.state.availableTasks = [...this.allTasks];
        }
    }

    getTasksForRound() {

        let numberOfTasks = d6();
        let results = [];

        if (this.state.currentRound === 1 && this.config.difficulty === 0) {
            if (this.state.availableTasks.length === 0 && this.state.completedTasks.length === 0)
                this.state.availableTasks = [...this.allTasks];

            results = this.state.availableTasks.splice(0, 1);

            numberOfTasks--;
        }
        
        results = [...results, ...this._getTasks(numberOfTasks)];

        return results;
    }

    _getTasks(numberOfTasks) {
        if (numberOfTasks > this.state.availableTasks.length) numberOfTasks = this.state.availableTasks.length;

        let results = [];

        let numbers = [];
        for (let index = 0; index < numberOfTasks; index++) {
            let taskIndex = roll(this.state.availableTasks.length) - 1;

            while (numbers.includes(taskIndex) && this.state.availableTasks.length > 0) {
                taskIndex = roll(this.state.availableTasks.length) - 1;
            }
            numbers.push(taskIndex);
        }
        results = this.state.availableTasks.filter((v, i) => numbers.includes(i));
        this.state.availableTasks = this.state.availableTasks.filter((v, i) => !numbers.includes(i));
        return results;
    }
}
module.exports = TaskSelector;
