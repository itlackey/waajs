const { assert } = require("chai");
const Game = require("../src/Game");
const exampleGameConfig = require("./ExampleGame.json");

describe("GameEngine", () => {
    describe("Starting game", () => {
        it("should initialize a new game", async () => {
            const game = new Game(exampleGameConfig);
            await game.init();

            assert.equal("Example Game", game.config.title, "Title should be set in config");
            assert.equal(1, game.currentRound, "Should be the first round");
            assert.equal(0, game.currentPhase, "Should be task phase");
            assert.equal(0, game.successCounter, "Success meter should be reset");
            assert.isAbove(game.failureCounter, -1, "Failure counter should be reset, and baseline set");
        });

        it("should set the first task as the win task if mode is easy", async () => {
            const game = new Game(exampleGameConfig);
            await game.init();
            let tasks = game.startGame();

            assert.isTrue(tasks.currentTasks.some((t) => t.id == 1.1), "Task 0 should be selected");
            assert.isFalse(game.taskSelector.availableTasks.some((t) => t.id == 1.1), "It should remove this first task from the available tasks");
        });
    });

    describe('Playing a round', async () => {
        it('should not reuse tasks between rounds', async () => {
            const game = new Game(exampleGameConfig);
            await game.init();
            let tasks = game.startGame();


        });
    });
});
