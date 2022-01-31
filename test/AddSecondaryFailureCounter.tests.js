const State = require("../src/State");
const { assert } = require("chai");
describe("AddSecondaryFailureCounter", () => {
    it("should shuffle task 4.2 back into the deck", async () => {
        const action = require("../src/Actions/AddSecondaryFailureCounter");
        const state = new State();
        state.secondaryFailureCounter = 1;

        action.run(state);
        assert.equal(state.secondaryFailureCounter, 2, "Counter did not add correctly");
    });
});
