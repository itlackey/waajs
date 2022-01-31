module.exports = {
    run: (state, args) => {
        //ToDo support arts from config
        //console.log("Secondary failure bonus");
        let index = state.previousTasks.findIndex(t => t.id == "4.2"); //args.id
        if(index > -1){            
            state.availableTasks.push(state.previousTasks[index]);
            state.previousTasks = state.previousTasks.splice(index, 1);
        }
    },
};
