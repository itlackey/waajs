const State = require("../src/State");
const { assert } = require("chai");
describe('SuccessCheck', () => {
   
    it("should calculate success rate when 1.1 card is held", async () => {
        const action = require("../src/Actions/SuccessCheck");
        
        action.rollDice = () => 6;
        const state = {
            successCounterActive: true,
            successCounter: 0
        };
        action.run(state)
        assert.equal(state.successCounter, 1, "should have a success counter after rolling a six");
    });
});