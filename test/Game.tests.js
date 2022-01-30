const { assert } = require("chai");
const Game = require("../src/Game");
const exampleGameConfig = require("./GameTemplate.json");

describe("GameEngine", () => {
    describe("Starting game", () => {
        it("should initialize game engine", async () => {
            const game = new Game(exampleGameConfig);
            await game.init();

            assert.equal(exampleGameConfig.title, game.config.title, "Title should be set in config");
            assert.equal(-1, game.state.currentRound, "Should not be set");
            assert.equal(-1, game.state.currentPhase, "Should not be set");
            assert.equal(-1, game.state.successCounter, "Success meter should not be set");
            assert.equal(-1, game.state.failureCounter, "Failure counter should not be set");
        });

        it("should start a new game", async () => {
            const game = new Game(exampleGameConfig);
            await game.init();
            game.startGame();
            assert.equal(exampleGameConfig.title, game.config.title, "Title should be set in config");
            assert.equal(1, game.state.currentRound, "Should not be the first round");
            assert.equal(0, game.state.currentPhase, "Should be task phase");
            assert.isAtLeast(game.state.successCounter, 0, "Success meter should be reset");
            assert.isAtMost(game.state.successCounter, 1, "Success meter should be reset");
            assert.isAtLeast(game.state.failureCounter, 0, "Failure counter should be reset");
            assert.isAtMost(game.state.failureCounter, 100, "Failure counter should be reset");
        });

        it("should set the first task as the win task if mode is easy", async () => {
            const game = new Game(exampleGameConfig);
            await game.init();
            let tasks = game.startGame();

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
            const game = new Game(exampleGameConfig);
            await game.init();
            let selectedTasks = game.startGame();

            let currentTasks = game.beginRound();
            while (currentTasks.length > 0) {
                assert.isFalse(
                    selectedTasks.some((st) => currentTasks.some((ct) => ct.id === st.id)),
                    "should not reuse tasks"
                );
            }
        });
        it("should eliminate a failure counter when a 1 is rolled", () => {
            const game = new Game(exampleGameConfig);
            game.rollD6 = () => 1;
            let result = game.calculateFailureScore(10, [
                {
                    failureScore: 1,
                },
            ]);

            assert.equal(result, 0);
        });

        it("should not eliminate a failure counter when the roll is greater than 1", () => {
            const game = new Game(exampleGameConfig);
            game.rollD6 = () => 2;
            let result = game.calculateFailureScore(10, [
                {
                    failureScore: 1,
                },
            ]);

            assert.equal(result, 10);
        });

        it("should not allow a failure counter less than 0", () => {
            const game = new Game(exampleGameConfig);
            game.init();
            game.startGame();
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
        it("player should win if the desk runs out", () => {
            const game = new Game(require("./ShortExampleGame.json"));
            game.init();
            game.startGame();
            do {
                let tasks = game.beginRound();

                assert.isTrue(
                    game.failureCounter == 0 ||
                        game.successCounter == 10 ||
                        game.taskSelector.availableTasks.length > 0,
                    "success counter should be set to 10 if out of cards"
                );
            } while (
                game.failureCounter > 0 &&
                game.successCounter < 10 &&
                game.taskSelector.availableTasks.length > 1
            );
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

        it("should calculate success rate when 1.1 card is held", () => {
            const game = new Game(exampleGameConfig);
            game.init();
            game.startGame();
            game.rollD6 = () => 6;
            game.beginRound();
            assert.equal(game.state.successCounter, 1, "should have a success counter after rolling a six");
        });
    });
});
