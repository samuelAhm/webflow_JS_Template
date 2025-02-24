export const handleSwiperNavigation = (
  swiper: any,
  nextButton: HTMLElement,
  prevButton: HTMLElement,
  checkoutBtn: HTMLElement
) => {
  let isEnd = false;

  if (swiper.activeIndex === 0) {
    prevButton.classList.add('is-hidden');
  }

  swiper.on('reachEnd', function () {
    isEnd = true;
  });

  swiper.on('slideChange', function () {
    console.log(swiper.activeIndex);

    if (swiper.activeIndex >= 1) {
      prevButton.classList.remove('is-hidden');
    } else {
      prevButton.classList.add('is-hidden');
    }

    if (isEnd) {
      console.log('end');
      checkoutBtn.classList.remove('hide');
      nextButton.classList.add('is-hidden');
    } else {
      checkoutBtn.classList.add('hide');
      nextButton.classList.remove('is-hidden');
    }
    isEnd = false;
  });
  console.log(swiper);
};
