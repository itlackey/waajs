module.exports = {
    run: (state) => {
        //console.log("Incementing secondary failure", state.secondaryFailureCounter);
        state.secondaryFailureCounter++;
        //console.log("Incemented secondary failure", state.secondaryFailureCounter);
    },
};
