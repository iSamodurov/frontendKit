import { initPhoneMask, initMap } from './utils/functions';

/* ---- Global vars & methods ---- */
window.initMap = initMap;


/* ---------- onLoad ---------- */
document.addEventListener('DOMContentLoaded', function(){
    $('form').parsley();
    initPhoneMask();
});
