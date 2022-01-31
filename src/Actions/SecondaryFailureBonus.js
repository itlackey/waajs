module.exports = {
    run: (state) => {
        let index = state.completedTasks.findIndex((t) => t.id == "4.2");
        if (index > -1) {
            state.secondaryFailureCounter--;
            let task = state.completedTasks.splice(index, 1);
            state.availableTasks.push(task);
        }
    },
};
