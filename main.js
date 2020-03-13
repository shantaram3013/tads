game.loadPrompts = () => {
    game.prompts = new Map();
    for (var key in game.dataJSON) {
        game.prompts.set(key, new Prompt(
            game.dataJSON[key].text,
            game.dataJSON[key].heading,
            game.dataJSON[key].choices
        )
        );
    }
    game.setCurrentPrompt("0000");
}

game.init = () => {
    game.currentLevel = 0;
    
    game.writer = new Typewriter(document.getElementById("mainText"),
    {
        beginningCallback: disableAllButtons,
        endingCallback: enableAllButtons
    });
    game.writer.setCaret("_");
    game.writer.setCaretPeriod(500);
    game.writer.setDelay(localStorage.averageDelay, localStorage.variance);

    game.audio = {};
    game.audio.snipFX = new Audio("sfx");

    game.loadPrompts();

}

game.update = () => {
    game.generateChoices();
    game.currentPrompt.draw();
}

game.setCurrentPrompt = (id) => {
    game.currentPrompt = game.prompts.get(id);
    game.update();
}

game.generateChoices = () => {
    document.getElementById("choiceWrapper").innerHTML = "";

    if (game.currentPrompt.choices) {
        for (let x of game.currentPrompt.choices) {
            x.toHTMLChoice();
        }
    }
}

window.onload = function() {
    setTimeout(game.init, 500);
}