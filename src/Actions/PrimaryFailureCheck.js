const { d6 } = require("../Dice");
class PrimaryFailureCheck { //extends ActionBase {
    //super()
    rollDice = d6;
    run(state){
        let score = 0;
        for (let diceIndex = 0; diceIndex < state.primaryFailureCounter; diceIndex++) {
            let number = this.rollDice(); 
            if (number === 1) {
                score++;
                if (score === state.primaryFailureCounter) break;
            }
        }
        state.primaryFailureCounter = state.primaryFailureCounter - score;
    }

}
const instance = new PrimaryFailureCheck();
module.exports = instance;