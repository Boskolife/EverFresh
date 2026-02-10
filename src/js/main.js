import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function updateCurrentYear() {
  const currentYear = new Date().getFullYear();
  const currentYearElement = document.querySelector('.current-year');
  if (currentYearElement) {
    currentYearElement.textContent = currentYear;
  }
}

function initBeforeAfterSlider() {
  const container = document.querySelector('.positioning__item-images');
  const slider = container?.querySelector('.positioning__slide-button');
  const beforeImage = container?.querySelector(
    '.positioning__image.before-img',
  );
  const afterImage = container?.querySelector('.positioning__image.after-img');

  if (!container || !slider || !beforeImage || !afterImage) return;

  const clipTarget = beforeImage.querySelector('img');
  if (!clipTarget) return;

  if (!container.id) container.id = 'before-after-slider';
  slider.setAttribute('aria-controls', container.id);

  const itemTitle = container
    .closest('.positioning')
    ?.querySelector('.positioning__title');
  if (itemTitle && slider.getAttribute('aria-label')?.includes('Lorem Ipsum')) {
    const titleText = itemTitle.textContent.trim();
    slider.setAttribute(
      'aria-label',
      `Drag slider to compare before and after images for ${titleText}`,
    );
  }

  let isDragging = false;
  let currentPercentage = 50;
  let dragOffset = 0;

  const initSlider = () => {
    currentPercentage = 50;
    const clipPathValue = `inset(0 ${100 - currentPercentage}% 0 0)`;
    slider.style.left = `${currentPercentage}%`;
    slider.style.transform = 'translate(-50%, -50%)';
    slider.style.webkitTransform = 'translate(-50%, -50%)';
    clipTarget.style.clipPath = clipPathValue;
    clipTarget.style.webkitClipPath = clipPathValue;
    slider.setAttribute('aria-valuenow', currentPercentage);
    slider.setAttribute(
      'aria-valuetext',
      `${currentPercentage}% - showing ${currentPercentage}% before and ${
        100 - currentPercentage
      }% after`,
    );
  };

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left - dragOffset;
    currentPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const clipPathValue = `inset(0 ${100 - currentPercentage}% 0 0)`;
    slider.style.left = `${currentPercentage}%`;
    slider.style.transform = 'translate(-50%, -50%)';
    slider.style.webkitTransform = 'translate(-50%, -50%)';
    clipTarget.style.clipPath = clipPathValue;
    clipTarget.style.webkitClipPath = clipPathValue;
    const roundedPercentage = Math.round(currentPercentage);
    slider.setAttribute('aria-valuenow', roundedPercentage);
    slider.setAttribute(
      'aria-valuetext',
      `${roundedPercentage}% - showing ${roundedPercentage}% before and ${
        100 - roundedPercentage
      }% after`,
    );
  };

  const handleStart = (clientX, isClickOnSlider = false) => {
    isDragging = true;
    slider.style.transition = 'none';
    clipTarget.style.transition = 'none';

    if (isClickOnSlider) {
      const sliderRect = slider.getBoundingClientRect();
      const sliderCenterX = sliderRect.left + sliderRect.width / 2;
      dragOffset = clientX - sliderCenterX;
    } else {
      dragOffset = 0;
    }

    updateSlider(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    updateSlider(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = '';
    clipTarget.style.transition = '';
  };

  initSlider();

  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleStart(e.clientX, true);
  });

  const mouseMoveHandler = (e) => {
    if (isDragging) handleMove(e.clientX);
  };
  const mouseUpHandler = () => handleEnd();

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX, true);
  });

  const touchMoveHandler = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    }
  };
  const touchEndHandler = () => handleEnd();

  document.addEventListener('touchmove', touchMoveHandler, { passive: false });
  document.addEventListener('touchend', touchEndHandler);

  slider.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 1;
    let newPercentage = currentPercentage;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newPercentage = Math.max(0, currentPercentage - step);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newPercentage = Math.min(100, currentPercentage + step);
        break;
      case 'Home':
        e.preventDefault();
        newPercentage = 0;
        break;
      case 'End':
        e.preventDefault();
        newPercentage = 100;
        break;
      default:
        return;
    }

    currentPercentage = newPercentage;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clientX = rect.left + (currentPercentage / 100) * rect.width;
    updateSlider(clientX);
  });

  container.addEventListener('click', (e) => {
    if (e.target === slider || slider.contains(e.target)) return;
    updateSlider(e.clientX);
  });
}

function initReviewsSlider() {
  const swiperContainer = document.querySelector('.reviews__slider');
  if (!swiperContainer) return;

  new Swiper('.reviews__slider', {
    modules: [Navigation],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
      },
      0: {
        spaceBetween: 12,
      },
    },
  });
}

function initWorkSlider() {
  const workContainer = document.querySelector('.work__slider');
  if (!workContainer) return;

  new Swiper('.work__slider', {
    modules: [Navigation],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1.1,
        spaceBetween: 12,
      },
      460: {
        slidesPerView: 2,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 2.6,
        spaceBetween: 12,
      },
      960: {
        slidesPerView: 2.8,
        spaceBetween: 12,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1312: {
        slidesPerView: 3.2,
        spaceBetween: 20,
      },
    },
  });
}

updateCurrentYear();
initBeforeAfterSlider();
initReviewsSlider();
initWorkSlider();
