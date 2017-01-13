import PageTransitions from "./elementTransitions";
var Barba = require('barba.js');
export default function(beforeAnim, cb, animIn1, animOut1) {
    return Barba.BaseTransition.extend({

        start: function() {
            Promise
                .all([this.newContainerLoading, beforeAnim()])
                .then(this.runTransition.bind(this));
        },
        runTransition: function() {
            this.newContainer.parentElement.classList.add('et-wrapper', 'et-rotate');
            var animIn = animIn1 ? animIn1 : this.oldContainer.dataset.animationin ? this.oldContainer.dataset.animationin : (direction ? this.oldContainer.dataset.fowardAnimationin : this.oldContainer.dataset.backwardAnimationin),
                animOut = animOut1 ? animOut1 : this.oldContainer.dataset.animationout ? this.oldContainer.dataset.animationout : (direction ? this.oldContainer.dataset.fowardAnimationout : this.oldContainer.dataset.backwardAnimationout);
            this.newContainer.parentElement.setAttribute('et-in', animIn);
            this.newContainer.parentElement.setAttribute('et-out', animOut);
            this.oldContainer.classList.add('et-page');
            this.newContainer.classList.add('et-page');
            this.newContainer.style.visibility = 'visible';
            PageTransitions.init();
            var home;
            var x = this;

            PageTransitions.animate(document.getElementById('barba-wrapper'));


            setTimeout(function() {
                    done(x);
                },
                //TODO
                100 + 1000);

            function done(x) {
                cb.call(x);
                x.newContainer.parentElement.classList.remove('et-wrapper', 'et-rotate');
                x.newContainer.parentElement.dataset.etIn = false;
                x.newContainer.parentElement.dataset.etOut = false;
                x.oldContainer.classList.remove('et-page');
                x.newContainer.classList.remove('et-page');
                // Done


                x.done();
                document.querySelector('.menu').querySelector('li.active').classList.add('animating');

            }
        }
    });
}
