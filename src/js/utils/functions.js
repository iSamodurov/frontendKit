import Inputmask from "inputmask";

const initPhoneMask = () => {
    let inputs = document.querySelectorAll("input[type=tel]");
    let im = new Inputmask("+7 999 999-99-99");
    inputs.forEach(input => {
        im.mask(input);
    });
}


const initMap = (opts) => {
    if (!document.querySelector('#map')) return false;
    let coords = opts.coords || [56.154420, 40.426254];
    let iconUrl = opts.iconUrl || 'img/map-icon.png';
    let iconSize = opts.iconSize || [64, 70];
    let iconOffset = opts.iconImageOffset || [-32, -80];

    let center = coords;
    if (window.innerWidth < 570) {
        center = [coords[0] + 0.0015, coords[1]];
    } else {
        center = [coords[0], coords[1] - 0.002];
    }

    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: center,
                zoom: 17,
                controls: [],
            }),
            myPlacemark = new ymaps.Placemark(coords, {
                hintContent: '',
                balloonContent: ''
            }, {
                iconLayout: 'default#image',
                iconImageHref: iconUrl,
                iconImageSize: iconSize,
                iconImageOffset: iconOffset,
            });
        myMap.geoObjects.add(myPlacemark);
    });
}


export {
    initPhoneMask,
    initMap,
};
