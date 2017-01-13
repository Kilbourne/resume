var Barba = require('barba.js');
import transition from "./transition";
import fade from "./fade";
export default function(el) {
    Barba.Pjax.getTransition = function() {
        return el.classList.contains('lang-switch') ? fade : transition;
    };
    if (document.querySelector('.barba-container').dataset.namespace === 'home')
        document.querySelector('#printer-wrapper').remove();
}
