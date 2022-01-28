function generate(defaultOptions) {
    let results = {
        title: "Game Template",
        difficulty: 0,
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
                failureScore: taskIndex % 2 === 0 ? 1 : 0,
            };

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
                    failureScore: 12,
                },
            ],
        },
    ],
};
let results = generate({});
console.log(JSON.stringify(results));
