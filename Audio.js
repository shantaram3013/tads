class Audio {
    constructor (divId) {
        this.audio = document.getElementById(divId);
    }

    loop() {
        if (this.audio.loop) {
            this.audio.loop = !this.audio.loop;
        }
        else { 
            this.audio.loop = true;
        }
    }

    play() {
        if (localStorage.sound === "true") {
            this.audio.play();
        }
    }

    pause() {
        this.audio.pause();
    }
}
/*
INPUT: data.svf ("Shan's Visual novel Format") -->
  |  0000: Prologue
  |      I'm so tired of this dragon-slaying life.
  |          "...", 0, "0001"

$ ./compiler.py data.svf > data.js

OUTPUT: data.js -->
  |  game.dataJSON = {
  |      "0000": {
  |          heading: "Prologue",
  |          text: "I'm so tired of this dragon-slaying life.",
  |          choices: [
  |              new Choice("...", 0, "0001")
  |          ]
  |      }
  |  }
*/