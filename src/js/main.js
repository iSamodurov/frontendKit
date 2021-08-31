import { initPhoneMask } from './utils/functions';


document.addEventListener('DOMContentLoaded', function(){
    $('form').parsley();
    initPhoneMask();
});
