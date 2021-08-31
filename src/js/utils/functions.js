import Inputmask from "inputmask";

const initPhoneMask = () => {
    let inputs = document.querySelectorAll("input[type=tel]");
    let im = new Inputmask("+7 999 999-99-99");
    inputs.forEach(input => {
        im.mask(input);
    });
}


export {
    initPhoneMask,
};
