import { initPhoneMask, initMap } from './utils/functions';

window.initMap = initMap;

document.addEventListener('DOMContentLoaded', function(){
    $('form').parsley();
    initPhoneMask();
});
