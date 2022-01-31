const { assert } = require("chai");
const Game = require("../src/Game");
const exampleGameConfig = require("./GameTemplate.json");

describe("GameEngine", () => {
    describe("Starting game", () => {
        it("should start a new game", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            assert.equal(exampleGameConfig.title, game.config.title, "Title should be set in config");
            assert.equal(0, game.state.currentRound, "Should not be set");
            assert.equal(-1, game.state.currentPhase, "Should not be set");
            assert.equal(0, game.state.successCounter, "Success meter should not be set");
            assert.equal(100, game.state.primaryFailureCounter, "Failure counter should not be set");
        });

        it("should start a game - with save data eventually", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            assert.equal(exampleGameConfig.title, game.config.title, "Title should be set in config");
            assert.isAtLeast(game.state.currentRound, 0, "Should be at least the first round");
            assert.isAtMost(game.state.currentPhase, 1, "Should be a valid phase");
            assert.isAtLeast(game.state.successCounter, 0, "Success meter should be reset");
            assert.isAtMost(game.state.successCounter, 1, "Success meter should be reset");
            assert.isAtLeast(game.state.primaryFailureCounter, 0, "Failure counter should be reset");
            assert.isAtMost(game.state.primaryFailureCounter, 100, "Failure counter should be reset");
        });

        it("should set the first task as the win task if mode is easy", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            let tasks = await game.beginRound();
            assert.isTrue(
                tasks.currentTasks.some((t) => t.id === "1.1"),
                "Task 0 should be selected"
            );
            const containsFirstTask = game.taskSelector.availableTasks.some((t) => {
                let matches = t.id === "1.1";
                return matches;
            });
            assert.equal(containsFirstTask, false, "It should remove this first task from the available tasks");
        });
    });

    describe("Playing a round", async () => {
        it("should not reuse tasks between rounds", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);

            let selectedTasks = await game.beginRound();
            let entries = selectedTasks.currentTasks.map((t) => {
                return {
                    id: t.id,
                    text: "test",
                };
            });
            await  game.endRound(entries);

            let results =await  game.beginRound();
            //while (results.currentTasks.length > 0) {
            assert.isFalse(
                selectedTasks.currentTasks.some((st) => results.currentTasks.some((ct) => ct.id === st.id)),
                "should not reuse tasks"
            );
            // }
        });
   

        it("should not allow a failure counter less than 0", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            let testing = true;
            while (testing) {
                await  game.beginRound();
                assert.isAtLeast(game.state.primaryFailureCounter, 0, "failure counter should not be less than 0");
                testing = game.state.primaryFailureCounter > 0;
            }
            assert.isAtLeast(game.state.primaryFailureCounter, 0, "failure counter should not be less than 0");
        });
    });

    describe("Winning", () => {
        it("game should end in a tie if the desk runs out", async () => {
            const game = new Game();
            await game.startGame(require("./ShortExampleGame.json"));
            game.rollDice = () => 2;
            do {
                await  game.beginRound();
            } while (game.taskSelector.availableTasks.length >= 1);

            assert.isTrue(game.state.successCounter < 10, "Game should not have been won");
            assert.isTrue(game.state.primaryFailureCounter > 0, "Game should not have been lost");
            assert.isTrue(game.taskSelector.availableTasks.length === 0, "should be out of cards");
        });

        it("should calculate failure rate each round", () => {
            // const game = new Game(exampleGameConfig);
            // game.init();
            // game.startGame();
            // let testing = true;
            // while (testing) {
            //     game.beginRound();
            //     assert.isAtLeast(game.failureCounter, 0, "failure counter should not be less than 0");
            //     testing = game.failureCounter > 0;
            // }
            // assert.isAtLeast(game.failureCounter, 0, "failure counter should not be less than 0");
        });

       
    });
});
