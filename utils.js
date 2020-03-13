Array.prototype.choose = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function disableAllButtons() {
    for (let button of document.getElementsByTagName("button")) {
        button.style.display = "none";
    }
}

function enableAllButtons() {
    for (let button of document.getElementsByTagName("button")) {
        button.style.display = "initial";
    }
}