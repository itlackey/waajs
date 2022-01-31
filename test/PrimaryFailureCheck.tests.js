const State = require("../src/State");
const { assert } = require("chai");
describe("PrimaryFailureCheck", () => {
    it("should remove a counter when a 1 is rolled", () => {});

    it("should eliminate a failure counter when a 1 is rolled", () => {
        const action = require("../src/Actions/PrimaryFailureCheck");
        const state = new State();
        state.primaryFailureCounter = 10;

        action.rollDice = () => 1;

        action.run(state);

        assert.equal(state.primaryFailureCounter, 0);
    });

    it("should not eliminate a failure counter when the roll is greater than 1", async () => {
        const action = require("../src/Actions/PrimaryFailureCheck");
        const state = new State();
        state.primaryFailureCounter = 10;

        action.rollDice = () => 2;

        action.run(state);

        assert.equal(state.primaryFailureCounter, 10);
    });
});
