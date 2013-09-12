/* UserActions.js */

var UserActions = function () {
    var evnt;
    var moveDist = 5;
    var keyboardMoves = {
        37: [-moveDist, 0], 38: [ 0, -moveDist],
        39: [moveDist, 0], 40: [0, moveDist]
    };
    var isAmebActive = false;

    function setActions() {

        addEventListener("keydown", function (e) {
//            l(e.which)
            if (e.which === 87) {     // a Automatic
                evnt.trigger("ameb.wagTail");
            }
            if (e.which === 65) {     // a Automatic
                evnt.trigger("UserActions.removeAmebAction");
                evnt.trigger("ActionScript.addTick");
            }
            else if (e.which === 77) {     // m     Manual
                evnt.trigger("UserActions.addAmebAction");
                evnt.trigger("ActionScript.removeTick");
            }
            else if (e.which === 82) {     // r    Reset
                evnt.trigger("game.reset");
            }
            else if (e.which === 73) {     // i    Intro
                evnt.trigger("Messages.toggleIntro");
            }
            else if (e.which === 191) {     // ?   Description
                evnt.trigger("Messages.toggleDescription");
            }
            if (isAmebActive) {
                if (e.which === 67) {     // c    Ameb.headConstraintToggle
                    evnt.trigger("ameb.headConstraintToggle");
                }
                else if (e.which === 32) {    // [space bar]
                    evnt.trigger("ameb.footConstraintToggle");
                }
                else if (e.which >= 37 && e.which <= 40) {
                    var moveKey = e.which;
                    evnt.trigger("ameb.moveHead", keyboardMoves[moveKey]);
                }
            }
        });
    }

    function removeAmebAction() {
        isAmebActive = false;
    }

    function addAmebAction() {
        isAmebActive = true;
    }

    function init() {
        evnt = G.EvntFactory.get();
        setActions();

        evnt.on("UserActions.addAmebAction", function () {
            addAmebAction();
        });
        evnt.on("UserActions.removeAmebAction", function () {
            removeAmebAction();
        });
    }

    return{
        init: function () {
            init();
        }
    }
}();
