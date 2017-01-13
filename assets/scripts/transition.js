import scrollToY from "./scrollToY";
import transition from "./move";
var Barba = require('barba.js');
var opts = transition(function() {
    var deferred = Barba.Utils.deferred();
    var home;
    if ((home = document.querySelector('.barba-container.home,.barba-container.header')) !== null)
        home.classList.remove('static');
    scrollToY(0, 400, 'easeOutSine', function() {
        deferred.resolve();
    });


    return deferred.promise;
}, function() {
    var home = document.querySelector('.barba-container.home,.barba-container.header');
    if (home !== null) home.classList.add('static');
    document.querySelector('body').classList.remove(this.oldContainer.dataset.namespace);
    document.querySelector('body').classList.add(this.newContainer.dataset.namespace);
});

export default opts;
