/*jslint browser: true, devel: true, this: true, unordered: true */

// 2021-12-07 initial
// 2021-12-11 added start beep and interval beeps as timer expires


var AudioContext;
var ctx;

const beep = function (vol, freq, duration) {
    var v = ctx.createOscillator();
    var u = ctx.createGain();
    v.connect(u);
    v.frequency.value = freq;
    v.type = "square";  // square, sine, sawtooth, triangle
    u.connect(ctx.destination);
    u.gain.value = vol * 0.01;
    v.start(ctx.currentTime);
    v.stop(ctx.currentTime + duration * 0.001);
};

const Timer = {
    start: function (duration) {
        var self = this;

        // start beep
        beep(999, 523.2512, 100);  // C5 (Tenor C)

        this.duration = duration;
        this.startTime = Date.now();

        (function timer() {
            var elapsedTime = Math.floor((Date.now() - self.startTime) / 1000);
            var remainingTime = self.duration - elapsedTime;

            // use caller's call back function to update the time display
            if (self.updateDisplay) {
                self.updateDisplay.call(this, remainingTime);
            }

            if (remainingTime === 0) {
                beep(999, 523.2512, 100);      // C5 (Tenor C)
                // use caller's call back function to notify when done
                if (self.expired) {
                    self.expired.call(this);
                }
            } else {
                if (remainingTime === 10) {
                    beep(999, 261.6256, 500);  // C4 (Middle C)
                    beep(999, 329.6276, 500);  // E4
                    beep(999, 391.9954, 500);  // G4
                } else if (remainingTime <= 4) {
                    beep(999, 261.6256, 100);  // C4
                }

                setTimeout(timer, 1000);
            }
        }());
    },

    // allow caller to register a callback function to display the time
    onUpdate: function (fn) {
        if (typeof fn === "function") {
            this.updateDisplay = fn;
        }
    },

    // allow caller to register a callback function to enable buttons,
    // play a sound, etc. when the timer expires
    onExpired: function (fn) {
        if (typeof fn === "function") {
            this.expired = fn;
        }
    }
};

// Set up audio context for beeps
if (window.AudioContext          // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false) {
    ctx = new AudioContext();
    if (ctx.state === "suspended") {
        ctx.resume();
    }
}

