const { assert } = require("chai");
const TaskSelector = require("../src/TaskSelector");

const exampleGameConfig = require("./ExampleGame.json");

describe("TaskSelector", () => {

    it("should select a list of tasks", () => {
        const selector = new TaskSelector(exampleGameConfig);

        let tasks = selector.getTasksForRound();

        console.log(tasks);
        assert.isAtLeast(tasks.length, 1, "Should return at least one task");
        assert.isAtMost(tasks.length, 6, "Should not have more than 6 tasks");

        const unique = tasks.map((t) => t.id).filter((v, i, s) => s.indexOf(v) === i);
        assert.equal(tasks.length, unique.length, "Should return only unique tasks");

    });
    it('should select task 1.1 the first draw when on easy mode', () => {
        const selector = new TaskSelector(exampleGameConfig);

        let tasks = selector.getTasksForFirstRound(0);
        console.log(tasks);
        assert.isAtLeast(tasks.length, 1, "Should return at least one task");
        assert.isAtMost(tasks.length, 6, "Should not have more than 6 tasks");

        assert.equal(tasks[0].id, 1.1, "First task should be 1.1");

        const unique = tasks.map((t) => t.id).filter((v, i, s) => s.indexOf(v) === i);
        assert.equal(tasks.length, unique.length, "Should return only unique tasks");
    });

    it('should remove the selected tasks from the available tasks', () => {
        const selector = new TaskSelector(exampleGameConfig);

        let tasks = selector.getTasksForRound();
        console.log(tasks);
        assert.isAtLeast(tasks.length, 1, "Should return at least one task");
        assert.isAtMost(tasks.length, 6, "Should not have more than 6 tasks");

        const unique = tasks.map((t) => t.id).filter((v, i, s) => s.indexOf(v) === i);
        assert.equal(tasks.length, unique.length, "Should return only unique tasks");

        const availableIds = selector.availableTasks.map(t => t.id)

        const taskIds = tasks.map(t => t.id);
        assert.isFalse(availableIds.some(t => taskIds.includes(t)), 'Returned tasks should be removed from available tasks');
    });
});
