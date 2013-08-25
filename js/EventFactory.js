/* EventFactory.js */

var G = { }; // G Global

G.Evnt = (function () {
    var events = [];
    return  {
        trigger: function (eName, data) {
            for (var e in events) {
                if (eName === events[e].e) {
                    events[e].callback(data);
                }
            }
        },
        on: function (eName, eventFunc) {
            events.push({e: eName, callback: eventFunc});
        },
        remove: function(eName){
            for (var e in events) {
                if (eName === events[e].e) {
                    events.splice(e, 1);
                }
            }
        }
    }
})()
G.EvntFactory = (function () {
    var evnt = G.Evnt;
    return {
        get: function () {
            return evnt;
        }
    }
})();