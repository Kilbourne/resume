    import menuItems from "./menuItems";
    var mappedRoutes = {};
    menuItems.forEach(function(el, i) {
        mappedRoutes[el.namespace] = i;
    });
    export default function(currentStatus, oldStatus, container) {

        window.direction = mappedRoutes[currentStatus.namespace] > mappedRoutes[oldStatus.namespace] ? true : false;

        if (document.querySelector('body').style.height !== 'auto')
            document.querySelector('body').style.height = 'auto';

    }
