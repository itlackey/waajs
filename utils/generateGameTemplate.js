function generate(defaultOptions) {
    let results = {
        title: "Game Template",
        difficulty: 0,
        intro: "",
        successMessage: "You win!",
        primaryFailureMessage: "You lose",
        secondaryFailureMessage: "You lose",
        categories: [],
    };
    for (let index = 1; index <= 4; index++) {
        let category = {
            name: `Category ${index}`,
            tasks: [],
        };
        //Merge default category
        if (defaultOptions.categories && defaultOptions.categories.length > index) {
            category.name = defaultOptions.categories[index].name;
        }

        for (let taskIndex = 1; taskIndex <= 13; taskIndex++) {
            const task = {
                id: `${index}.${taskIndex}`,
                title: `Task ${index}.${taskIndex}`,
                action: index === 2 || index === 4
                    || (index === 1 && taskIndex % 2 === 0) ? "PrimaryFailureCheck" : null,
            };

            //Set default actions for Aces and Kings
            if (taskIndex === 1) {
                switch (index) {
                    case 1:
                        task.action = "StartSuccessCounter";
                        break;
                    case 2:
                        task.action = "StartSuccessBonus";
                        break;
                    case 4:
                        task.action = "SecondaryFailureBonus";
                        break;

                    default:
                        break;
                }
            } else if (taskIndex === 2) {
                task.action = "AddSecondaryFailureCounter";
            }

            //Merge default task
            if (defaultOptions.categories) {
                const defaultTask = defaultOptions.categories.flatMap((c) => c.tasks).find((t) => t.id == task.id);
                if (defaultTask) Object.assign(task, defaultTask);
            }
            category.tasks.push(task);
        }
        results.categories.push(category);
    }

    delete defaultOptions.categories;
    Object.assign(results, defaultOptions);
    return results;
}

const partialGame = {
    title: "Example Partial Game",
    categories: [
        {
            tasks: [
                {
                    id: 1.1,
                    title: "Override",
                    action: "CustomFunction",
                },
            ],
        },
    ],
};
//ToDo: support loading from CSV?
let results = generate({});
console.log(JSON.stringify(results));
