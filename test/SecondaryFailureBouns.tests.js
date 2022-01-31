const State = require("../src/State");
const { assert } = require("chai");
describe("SecondaryFailureBonus", () => {
    it("should shuffle task 4.2 back into the deck", async () => {
        const action = require("../src/Actions/SecondaryFailureBonus");
        const state = new State();
        state.secondaryFailureCounter = 1;
        state.completedTasks = [
            {
                id: "3.7",
            },
            {
                id: "1.1",
            },
            {
                id: "4.2",
            },
            {
                id: "4.1",
            },
        ];
        state.availableTasks = [
            {
                id: "1.7",
            },
            {
                id: "2.1",
            },
            {
                id: "3.2",
            },
            {
                id: "3.1",
            },
        ];

        action.run(state);
        assert.equal(state.secondaryFailureCounter, 0, "Should remove counter");
        assert.equal(state.availableTasks.length, 5, "No available tasks");
        assert.equal(state.completedTasks.length, 3, "Error with completed tasks");
        assert.isTrue(
            state.availableTasks.some((t) => (t.id = "4.2")),
            "Task 4.2 not in available tasks"
        );
    });
});
