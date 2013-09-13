/* Util.js */

function rand(low, high) {
    var num = 0;
    num = (Math.random() * (high - low));
    num = num + low;
    return Math.floor(num);
}

window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
