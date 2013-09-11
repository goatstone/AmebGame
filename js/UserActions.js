/* UserActions.js */

var UserActions = function () {
    var evnt;
    var moveDist = 5;
    var keyboardMoves = {
        37: [-moveDist, 0], 38: [ 0, -moveDist],
        39: [moveDist, 0], 40: [0, moveDist]
    };

    function setActions() {

        addEventListener("keydown", function (e) {
            if (e.which === 82) {     // r
                evnt.trigger("game.reset");
            }
            if (e.which === 73) {     // i
                evnt.trigger("Messages.toggleIntro");
            }
            if (e.which === 191) {     // ?
                evnt.trigger("Messages.toggleDescription");
            }
            if (e.which === 67) {     // c
                evnt.trigger("ameb.headConstraintToggle");
            }
            if (e.which === 32) {    // [space bar]
                evnt.trigger("ameb.footConstraintToggle");
            }
            if (e.which >= 37 && e.which <= 40) {
                var moveKey = e.which;
                evnt.trigger("ameb.moveHead", keyboardMoves[moveKey]);
            }
        });
    }

    function init() {
        evnt = G.EvntFactory.get();
        setActions();
    }

    return{
        init: function () {
            init();
        }
    }
}();
