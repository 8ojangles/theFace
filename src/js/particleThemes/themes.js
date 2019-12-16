var fireTheme = require('./themes/fire/theme.js').fireTheme;
var resetTheme = require('./themes/reset/resetTheme.js').resetTheme;
var warpStarTheme = require('./themes/warpStar/warpStarTheme.js').warpStarTheme;
var flameTheme = require('./themes/flame/flameTheme.js').flameTheme;
var smokeTheme = require('./themes/smoke/smokeTheme.js').smokeTheme;

var themes = {
   reset: resetTheme,
   fire: fireTheme,
   warpStar: warpStarTheme,
   flame: flameTheme,
   smoke: smokeTheme
};

module.exports.themes = themes;