
/**
 * Re - maps a number from one range to another.
 * @param {*} n
 * @param {*} start1
 * @param {*} stop1
 * @param {*} start2
 * @param {*} stop2
 * @return {*}
 */
export function mapRange(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}


/**
 * Функция для скролла по странице
 * <a href="javascript:;" data-scroll-to="#contacts"></a>
 */
export function initScrollTo() {
  $("*[data-scroll-to]").click(function () {
    let target = $(this).attr('data-scroll-to');
    $([document.documentElement, document.body]).animate({
      scrollTop: $(target).offset().top
    }, 500);
  });
}
