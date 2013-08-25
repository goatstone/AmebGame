/* message.js */

var msg = function () {
    var msgs = {
        title: ["Ameb"],
        credit: ["- Designed and Developed by Goatstone, 2013"],
        description: [
            "Press the '?' key to see this description at any time.",
            "Ameb has only a head, a foot and a tail. ",
            "Ameb must eat bugs to stay alive!"  ,
            "Move Amebs' head with the arrow keys and catch bugs." ,
            "Lock and unlock Amebs' head with the 'c' key."  ,
            "Lock and unlock Amebs' foot with the 'space bar' key.",
            "Press the \"r\" key to reset   ."

        ],
        labels: {"healthPoints": "Health Points: ", "bugsEaten": " | Bugs Eaten: "},
        statusStates: {"die": "Amed is Dead!"},
        keyboard: {c: "Lock or free the head", spaceBar: "Lock or free the Foot", arrowKeys: "move Ameb's head" }
    };
    var intro = [ msgs.title[0] + " " + msgs.credit[0] ];
    var selectedMsgs = [];
    var top = 30;
    var evnt = G.EvntFactory.get();
    var ticks = 0;
    var statusDOM = null;

    function clear() {
        selectedMsgs = [];
    }

    function onTick() {
        if (ticks === 5) {
            clear();
            selectedMsgs = msgs.description;
        }
        else if (ticks === 15) {
            selectedMsgs = [];
        }
        ticks++;
    }

    return{
        init: function () {
            statusDOM = document.getElementById("status");
            var startTime = Date.now();
            var endTime = startTime + 1000;
            evnt.on("tick", function () {
                onTick();
            })

            evnt.on("game.reset", function (data) {
                selectedMsgs = [];
            })

            evnt.on("ameb.tick", function (data) {
                statusDOM.innerHTML =  msgs.labels.healthPoints + data.healthPoints + msgs.labels.bugsEaten + data.bugsEaten + "  ";
            })
            evnt.on("ameb.die", function () {
                statusDOM.innerHTML = msgs.statusStates.die;
                selectedMsgs = [msgs.description[6]];
            })

        }, draw: function (ctx) {
            ctx.fillStyle = "#006";
            ctx.font = "14pt Arial";
            top = 30;
            for (var m in selectedMsgs) {
                ctx.fillText(selectedMsgs[m], 10, top);
                top += 25;
            }
            ctx.stroke();
        },
        toggleIntro: function () {
            if (selectedMsgs !== intro) {
                selectedMsgs = intro;
            } else {
                selectedMsgs = [];
            }
        },
        hasMessages: function () {
            return (selectedMsgs.length > 0) ? true : false;
        },
        toggleDescription: function () {
            if (selectedMsgs !== msgs.description) {
                selectedMsgs = msgs.description;
            } else {
                selectedMsgs = [];
            }
        }
    }
}();
