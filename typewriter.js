/**
 * @file Simulates typing into an HTML element.
 * @author Mark E. Haase <mehaase@gmail.com>
 * modified by shantaram, any spaghetti is not Mark's fault
 * @version 1.0.0
 * @license BSD 2-clause - see typewriter-license.md
 */

/**
 * A class for simulating a person typing into an HTML element.
 *
 * @class Typewriter
 * @param {HTMLElement} element An HTML element to type the text inside of.
 */

function Typewriter(element, callbacks) {
    this.currentlyTyping = false;
    // Convert jQuery object to plain DOM object.
    if (typeof jQuery != 'undefined' && element instanceof jQuery) {
        element = element[0];
    }

    if (callbacks) {
        if (callbacks.endingCallback) {
            this.endingCallback = callbacks.endingCallback;
        }
    }

    // Create a text node if this element doesn't already have one.
    this._textNode = null;

    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeType == 3) {
            _textNode = element.childNodes[i];
            break;
        }
    }

    if (!this._textNode) {
        this._textNode = document.createTextNode("");
        element.appendChild(this._textNode);
    }

    // Create the caret.
    this._caretElement = document.createElement("span");
    this._caretTextNode = document.createTextNode("");
    this._caretElement.appendChild(this._caretTextNode);
    element.appendChild(this._caretElement);

    this.setCaret("|");
    this.setCaretPeriod(1000);

    // Initialize the delay distribution.
    this.setDelay(250, 100);
}

/**
 * Set the caret character.
 *
 * @param {string} character A character to use as the caret.
 *
 * Pass a blank string to effectively hide the caret.
 */
Typewriter.prototype.setCaret = function (character) {
    this._caretTextNode.nodeValue = character;
}

/**
 * Change caret's flashing speed.
 *
 * @param {int} [caretPeriod] The period of the flashing caret in milliseconds.
 *
 * Pass zero to disable flashing.
 */
Typewriter.prototype.setCaretPeriod = function (period) {
    var that = this;

    if (this._caretInterval) {
        clearInterval(this._caretInterval);
    }

    if (period) {
        this._caretInterval = setInterval(function () {
            if (that._caretElement.style.display == "none") {
                that._caretElement.style.display = "";
            } else {
                that._caretElement.style.display = "none";
            }
        }, period);
    } else {
        that._caretElement.style.display = "";
    }
}

/**
 * Change the randomized delay between keystrokes.
 *
 * @param {int} mean The average length of time in milliseconds between keystrokes.
 * @param {int} variance The maximum variance in milliseconds (away from the mean) between keystrokes.
 *
 * For example, with mean = 200 and variance = 50, each delay will
 * be sampled from the uniform distribution over [150, 250).
 */
Typewriter.prototype.setDelay = function (mean, variance) {
    this._delayMean = mean;
    this._delayVariance = variance;
}

/**
 * Simulate somebody typing text into an element, replacing the original text.
 *
 * @param {string} text The text to be typed.
 * @param {boolean} [instant=false] If true, ignore the currently configured delay and don't use character callback.
 */
Typewriter.prototype.replaceAndType = function (text, instant) {

    if (typeof instant === 'undefined') {
        instant = false;
    }

    if (this.currentlyTyping) {
        return;
    }

    if (text === this._textNode.nodeValue) {
        return;
    }

    this._textNode.nodeValue = "";
    if (instant || this._delayMean == 0) {
        this._textNode.nodeValue += text;

        if (this._completionCallback) {
            this._completionCallback();
        }
    } else {
        this._typeTextAtIndex(text, 0);
    }
}

/**
 * Return an integer value sampled from the delay distribution.
 *
 * @return {int} Sampled from delay mean and variance.
 */
Typewriter.prototype._sampleDelay = function () {
    var lower_bound = this._delayMean - this._delayVariance;
    var range = this._delayVariance * 2;

    return Math.floor(Math.random() * range + lower_bound);
}

/**
 * A helper that types one character at a time.
 *
 * @param {string} text - The text to be typed.
 * @param {string} text - The text to be typed.
 * @param {Function} [characterCallback] Called after every character has been typed.
 * @param {Function} [completionCallback] Called after _all_ characters have been typed.
 */
Typewriter.prototype._typeTextAtIndex = function (text, index) {
    var that = this;
    this.currentlyTyping = true;
    // Are we at the end of the text?
    if (index == text.length) {
        if (this.endingCallback) {
            this.endingCallback();
        }
        this.currentlyTyping = false;
        return;
    }

    // Type the character.
    var character = text.charAt(index);

    if (character === "\b") {
        // This is a delete character: _remove_ the last character.
        var newLength = this._textNode.nodeValue.length - 1;
        this._textNode.nodeValue = this._textNode.nodeValue.substring(0, newLength);
    } else {
        this._textNode.nodeValue += text[index];
    }

    // Schedule the next character.
    setTimeout(
        function () {
            that._typeTextAtIndex(text, index + 1);
        },
        this._sampleDelay()
    );
}