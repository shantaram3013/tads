
class Prompt {
    constructor(text, heading, choices) {
        this.text = text;
        this.choices = choices;
        this.heading = heading;
    }

    draw() {
        disableAllButtons();
        game.writer.replaceAndType(this.text);
        if (this.heading) {
            document.getElementById("heading").innerHTML = this.heading;
            document.getElementById("heading").style.paddingTop = "50px";
        }
        else {
            document.getElementById("heading").innerHTML = "";
            document.getElementById("heading").style.paddingTop = "82px";
        }
    }
}