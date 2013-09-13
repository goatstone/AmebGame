/* message.js */

var Messages = function() {
    var msgs = {
        title: ['AMEB'],
        credit: ['Designed and Developed by Goatstone, 2013'],
        description: [
            'Ameb has only a head, a foot and a tail. ',
            'Ameb must eat bugs to stay alive!'
        ],
        insructions: [
            "'?' key shows this description at any time.",
            'Arrow keys Move Amebs\' head to catch bugs.',
            '"c" key locks and unlocks Amebs\' head in place.' ,
            '"space bar" locks and unlocks Amebs\' foot in place.',
            '"a" key puts Ameb in Automatic mode.',
            '"m" key puts Ameb in Manual mode.' ,
            '"w" key to wag Amebs\' tail.',
            '"r" key to reset the game.'
        ],

        labels: {'healthPoints': 'Health Points: ',
            'bugsEaten': ' | Bugs Eaten: '},
        statusStates: {'die': 'Amed is Dead!'},
        keyboard: {c: 'Lock or free the head', spaceBar:
            'Lock or free the Foot', arrowKeys: "move Ameb's head" }
    };
    var intro = [msgs.title[0] , msgs.credit[0]];
    var fullDesc = [msgs.title[0] , msgs.credit[0]];
    fullDesc = fullDesc.concat(msgs.description);
    fullDesc = fullDesc.concat(msgs.insructions);

    var selectedMsgs = [];

    var top = 30;
    var evnt = G.EvntFactory.get();
    var ticks = 0;
    var statusDOM = null;
    var userHasResponded = false;

    function init() {
        statusDOM = document.getElementById('status');
        var startTime = Date.now();
        var endTime = startTime + 1000;

        evnt.on('UserActions.userResponse', function() {
            userHasResponded = true;
        });

        evnt.on('tick', function() {
            onTick();
        });
        evnt.on('game.draw', function(ctx) {
            if (hasMessages()) {
                draw(ctx);
            }
        });
        evnt.on('game.reset', function(data) {
            selectedMsgs = [];
        });
        evnt.on('ameb.tick', function(data) {
            statusDOM.innerHTML =
                msgs.labels.healthPoints + data.healthPoints +
                    msgs.labels.bugsEaten + data.bugsEaten + '  ';
        });
        evnt.on('ameb.die', function() {
            statusDOM.innerHTML = msgs.statusStates.die;
            selectedMsgs = [msgs.insructions[7]];
        });
        evnt.on('Messages.toggleIntro', function(data) {
            toggleIntro();
        });
        evnt.on('Messages.toggleDescription', function(data) {
            toggleDescription();
        });
        evnt.on('Messages.toggleFullDescription', function(data) {
            toggleFullDescription();
        });
    }

    function onTick() {
        if (ticks === 3 && !userHasResponded) {
            toggleFullDescription();
        }
        if (ticks === 19) {
            clear();
        }
        ticks++;
    }

    function clear() {
        selectedMsgs = [];
    }

    function toggleIntro() {
        if (selectedMsgs !== intro) {
            selectedMsgs = intro;
        } else {
            selectedMsgs = [];
        }
    }

    // toggleFullDescription(){}
    function toggleFullDescription() {
        //fullDesc
        if (selectedMsgs !== fullDesc) {
            selectedMsgs = fullDesc;
        } else {
            selectedMsgs = [];
        }
    }

    function toggleDescription() {
        if (selectedMsgs !== msgs.description) {
            selectedMsgs = msgs.description;
        } else {
            selectedMsgs = [];
        }
    }
//     var startTop;

    function draw(ctx) {
        var startTop = 30;
        var inc = startTop;
        var lineHeight = 22;
        ctx.fillStyle = '#f00';
        ctx.strokeStyle = '#f00';
        ctx.font = '18px Arial';

        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(210, 250, 210, .7)';
        ctx.rect(1, startTop - 20, 450,
            (selectedMsgs.length * lineHeight + 10));
        ctx.fill();
        ctx.closePath();

        for (var m in selectedMsgs) {
            ctx.font = '18px Arial';
            ctx.fillStyle = '#111';
            ctx.fillText(selectedMsgs[m], 10, inc);
            ctx.font = '18px Arial Bold';
            ctx.fillStyle = '#00f';
            inc += lineHeight;
        }

    }

    function hasMessages() {
        return (selectedMsgs.length > 0) ? true : false;
    }

    return{
        init: function() {
            init();
        }
    };
}();
