module.exports = {
    run: (state) => {
        const result = {
            message: "Starting success bonus",
        };
        state.successBonusActive = true;
        return result;
    },
};
