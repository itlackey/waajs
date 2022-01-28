const { d6, d20, roll } = require("./Dice");
//ToDo: rename to "Deck"
class TaskSelector {
    constructor(availableTasks = []) {
        this.availableTasks = availableTasks; // this.config.categories.flatMap((c) => c.tasks); //4 * 13
        this.allTasks = [...this.availableTasks];

    }   
    getTasksForFirstRound(difficulty) {
        let numberOfTasks = d6();
        let results = [];
        if (difficulty === 0) {

            results = this.availableTasks.splice(0, 1);
            numberOfTasks--;
        }

        let remainingTasks = this.getTasks(numberOfTasks);
        remainingTasks.forEach(t => results.push(t));
        return results;
    }

    getTasksForRound() {
        let numberOfTasks = d6();

        let results = this.getTasks(numberOfTasks);

        return results;
    }

    getTasks(numberOfTasks) {
        if (numberOfTasks > this.availableTasks.length)
            numberOfTasks = this.availableTasks.length;

        let results = [];

        let numbers = [];
        for (let index = 0; index < numberOfTasks; index++) {
            let taskIndex = roll(this.availableTasks.length) - 1;

            while (numbers.includes(taskIndex) && this.availableTasks.length > 0) {
                taskIndex = roll(this.availableTasks.length) - 1;
            }
            numbers.push(taskIndex);
        }
        results = this.availableTasks.filter((v, i) => numbers.includes(i));
        this.availableTasks = this.availableTasks.filter((v, i) => !numbers.includes(i));
        return results;
    }
}
module.exports = TaskSelector;
