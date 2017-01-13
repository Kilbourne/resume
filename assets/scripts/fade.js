import transition from "./move";
var Barba = require('barba.js');
var opts = transition(function() {}, function() {}, 'fadeIn', 'fadeOut');

export default opts;
