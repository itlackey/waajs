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
            assert.equal(100, game.state.failureCounter, "Failure counter should not be set");
        });

        it("should start a game - with save data eventually", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            assert.equal(exampleGameConfig.title, game.config.title, "Title should be set in config");
            assert.isAtLeast(game.state.currentRound, 0, "Should be at least the first round");
            assert.isAtMost(game.state.currentPhase, 1, "Should be a valid phase");
            assert.isAtLeast(game.state.successCounter, 0, "Success meter should be reset");
            assert.isAtMost(game.state.successCounter, 1, "Success meter should be reset");
            assert.isAtLeast(game.state.failureCounter, 0, "Failure counter should be reset");
            assert.isAtMost(game.state.failureCounter, 100, "Failure counter should be reset");
        });

        it("should set the first task as the win task if mode is easy", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            let tasks = game.beginRound();
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

            let selectedTasks = game.beginRound();
            let entries = selectedTasks.currentTasks.map((t) => {
                return {
                    id: t.id,
                    text: "test",
                };
            });
            game.endRound(entries);

            let results = game.beginRound();
            //while (results.currentTasks.length > 0) {
            assert.isFalse(
                selectedTasks.currentTasks.some((st) => results.currentTasks.some((ct) => ct.id === st.id)),
                "should not reuse tasks"
            );
            // }
        });
        it("should eliminate a failure counter when a 1 is rolled", () => {
            const game = new Game(exampleGameConfig);
            game.rollDice = () => 1;
            let result = game.calculateFailureScore(10, [
                {
                    failureScore: 1,
                },
            ]);

            assert.equal(result, 0);
        });

        it("should not eliminate a failure counter when the roll is greater than 1", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            game.rollDice = () => 2;
            let result = game.calculateFailureScore(10, [
                {
                    failureScore: 1,
                },
            ]);

            assert.equal(result, 10);
        });

        it("should not allow a failure counter less than 0", async () => {
            const game = new Game();
            await game.startGame(exampleGameConfig);
            let testing = true;
            while (testing) {
                game.beginRound();
                assert.isAtLeast(game.state.failureCounter, 0, "failure counter should not be less than 0");
                testing = game.state.failureCounter > 0;
            }
            assert.isAtLeast(game.state.failureCounter, 0, "failure counter should not be less than 0");
        });
    });

    describe("Winning", () => {
        it("game should end in a tie if the desk runs out", async () => {
            const game = new Game();
            await game.startGame(require("./ShortExampleGame.json"));
            game.rollDice = () => 2;
            do {
                game.beginRound();
            } while (game.taskSelector.availableTasks.length >= 1);

            assert.isTrue(game.state.successCounter < 10, "Game should not have been won");
            assert.isTrue(game.state.failureCounter > 0, "Game should not have been lost");
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

        it("should calculate success rate when 1.1 card is held", async () => {
            const game = new Game();
            game.rollDice = () => 6;
            await game.startGame(exampleGameConfig);
            game.beginRound();
            assert.equal(game.state.successCounter, 1, "should have a success counter after rolling a six");
        });
    });
});
