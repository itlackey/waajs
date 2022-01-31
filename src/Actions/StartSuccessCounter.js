const PrimaryFailureCheck = require('./PrimaryFailureCheck');
module.exports = {
    run: (state) => {
        const result = {
            message: "Starting success counter",
        };
        PrimaryFailureCheck.run(state);
        state.successCounterActive = true;
        return result;
    },
};
