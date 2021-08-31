import Swiper from 'swiper';

const initSlider = (selector) => {

    if (typeof selector !== 'string') return;
    if (!document.querySelector(selector)) return;
    
    const NEXT = '.swiper-button__next';
    const PREV = '.swiper-button__prev';

    let slider = new Swiper(selector, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        centeredSlidesBounds: true,
        init: false,
    });

    slider.on('init', () => {
        const first = slider.slides[0];
        const last = slider.slides[slider.slides.length-2];
        first.classList.add('swiper-slide__first');
        last.classList.add('swiper-slide__last');
        onInit();
    });

    const onInit = () => {
        $(slider.el).find(PREV).click(() => { slider.slidePrev() });
        $(slider.el).find(NEXT).click(() => { slider.slideNext() });
    }

    slider.on('slideChange', () => {
        let isLast = slider.activeIndex == slider.slides.length-2;
    });

    slider.init();
}

export default initSlider;