const { d6 } = require("../Dice");
class PrimaryFailureCheck { //extends ActionBase {
    //super()
    rollDice = d6;
    run(state){
        //console.log("Primary failure check");

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
// function calculateFailureScore(currentCounter, currentTasks) {
//     currentTasks
//         .filter((t) => t.failureScore > 0)
//         .forEach((t) => {
//             for (let scoreIndex = 0; scoreIndex < t.failureScore; scoreIndex++) {
//                 let score = 0;
//                 for (let diceIndex = 0; diceIndex < currentCounter; diceIndex++) {
//                     let number = this.rollDice(6);
//                     if (number === 1) {
//                         score++;
//                         if (score === currentCounter) break;
//                     }
//                 }
//                 currentCounter = currentCounter - score;
//             }
//         });

//     return currentCounter;
// }
