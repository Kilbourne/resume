var Barba = require('barba.js');
import elementRemove from "./elementRemove-shim.js";
import jsonClick from "./JsonClick";
import linkClicked from "./linkClicked";
import newPageReady from "./newPageReady";
import rafShim from "./raf-shim";
import ready from "./ready";
import elementDataset from "element-dataset";
elementDataset();
window.requestAnimFrame = rafShim;

ready(function() {
    Promise
        .all([(function() {
            var deferred = Barba.Utils.deferred();
            if (document.querySelectorAll('.barba-container.home').length && !('ontouchstart' in document.documentElement)) {
                require.ensure(['mobile-detect', 'skrollr', 'skrollr-ie'], function() {
                    var MobileDetect = require('mobile-detect');
                    var md = new MobileDetect(window.navigator.userAgent);
                    if (!md.mobile()) {

                        window.skrollr = require('skrollr');
                        var skrollrIE = require('skrollr-ie');
                        var skrollrInstance = skrollr.init();
                        document.getElementById('printer-wrapper').classList.remove('start');
                        deferred.resolve();

                    }

                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }())])
        .then(function() {

            document.querySelector('.menu').querySelector('li.active').classList.add('animating');
            Barba.Pjax.init();
            var direction = true;



            Barba.Dispatcher.on('newPageReady', newPageReady);
            Barba.Dispatcher.on('linkClicked', linkClicked);
            Barba.Prefetch.init();
            Barba.Pjax.start();
        });




    var buttons = document.querySelectorAll('.btn');
    if (buttons) {
        for (var i = buttons.length - 1; i >= 0; i--) {
            buttons[i].addEventListener('click', jsonClick);
        }
    }

});
