const { d6 } = require("../Dice");
class SuccessCheck {
    //extends ParentClass {
    //super()
    rollDice = d6;
    run(state) {
        //console.log("Success check");

        if (state.successCounterActive) {
            const result = this.rollDice();
            if (result === 6) state.successCounter++;
            else if (result === 5 && state.successBonusActive) state.successCounter++;
            return result;
        }
        return null;
    }
}
const instance = new SuccessCheck();
module.exports = {
    rollDice: instance.rollDice,
    run: instance.run,
};
