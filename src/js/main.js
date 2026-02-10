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

function initFormModal() {
  const modal = document.querySelector('.form-modal');
  if (!modal) return;

  const overlay = modal.querySelector('.form-modal__overlay');
  const closeButton = modal.querySelector('.form-modal__close');
  const steps = Array.from(
    modal.querySelectorAll('.form-modal__step'),
  );

  if (!steps.length) return;

  const step1 = modal.querySelector('.form-modal__step-1');
  const step2 = modal.querySelector('.form-modal__step-2');
  const step3 = modal.querySelector('.form-modal__step-3');
  const step4 = modal.querySelector('.form-modal__step-4');

  const step1Form = step1?.querySelector('form');
  const step2Form = step2?.querySelector('form');

  let currentStepIndex = 0;

  function setBodyScrollLocked(isLocked) {
    const docEl = document.documentElement;

    if (isLocked) {
      const scrollbarWidth = window.innerWidth - docEl.clientWidth;
      document.body.dataset.scrollLock = 'true';

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = 'hidden';
    } else {
      if (document.body.dataset.scrollLock) {
        delete document.body.dataset.scrollLock;
      }

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  function getStepErrorEl(stepElement) {
    return stepElement?.querySelector('[data-step-error]');
  }

  function clearStepErrors(stepElement) {
    if (!stepElement) return;
    stepElement.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
      el.removeAttribute('aria-invalid');
    });
    const errEl = getStepErrorEl(stepElement);
    if (errEl) {
      errEl.textContent = '';
      errEl.hidden = true;
    }
  }

  function showStepError(stepElement, message) {
    const errEl = getStepErrorEl(stepElement);
    if (errEl) {
      errEl.textContent = message;
      errEl.hidden = false;
    }
  }

  function markInvalidField(field) {
    if (!field) return;
    field.setAttribute('aria-invalid', 'true');
    if (typeof field.focus === 'function') {
      field.focus();
    }
  }

  function validateStep1() {
    if (!step1) return true;
    clearStepErrors(step1);

    const propertyTypeFirst = step1.querySelector('input[name="property-type"]');
    const propertyTypeChecked = step1.querySelector(
      'input[name="property-type"]:checked',
    );
    if (!propertyTypeChecked) {
      showStepError(step1, 'Please select a property type.');
      markInvalidField(propertyTypeFirst);
      return false;
    }

    const paintScopeFirst = step1.querySelector('input[name="paint-scope"]');
    const paintScopeChecked = step1.querySelector(
      'input[name="paint-scope"]:checked',
    );
    if (!paintScopeChecked) {
      showStepError(step1, 'Please select what you would like to paint.');
      markInvalidField(paintScopeFirst);
      return false;
    }

    const agreeInput = step1.querySelector('input[name="agree"]');
    if (!agreeInput || !agreeInput.checked) {
      showStepError(
        step1,
        'Please accept the Terms of Use and Privacy Policy to continue.',
      );
      markInvalidField(agreeInput);
      return false;
    }

    return true;
  }

  function validateStep2() {
    if (!step2) return true;
    clearStepErrors(step2);

    const firstNameInput = step2.querySelector('input[name="name"]');
    const lastNameInput = step2.querySelector('input[name="last-name"]');
    const emailInput = step2.querySelector('input[name="email"]');
    const phoneInput = step2.querySelector('input[name="phone"]');

    if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput) {
      return false;
    }

    if (!firstNameInput.value.trim()) {
      showStepError(step2, 'Please enter your first name.');
      markInvalidField(firstNameInput);
      return false;
    }

    if (!lastNameInput.value.trim()) {
      showStepError(step2, 'Please enter your last name.');
      markInvalidField(lastNameInput);
      return false;
    }

    if (!emailInput.value.trim()) {
      showStepError(step2, 'Please enter your email address.');
      markInvalidField(emailInput);
      return false;
    }

    if (!phoneInput.value.trim()) {
      showStepError(step2, 'Please enter your phone number.');
      markInvalidField(phoneInput);
      return false;
    }

    return true;
  }

  function validateStep3() {
    if (!step3) return true;
    clearStepErrors(step3);

    const checkedInputs = step3.querySelectorAll(
      '.form-modal__time-grid-input:checked',
    );

    if (!checkedInputs.length) {
      showStepError(
        step3,
        'Please select at least one preferred day and time slot.',
      );
      const firstSlotInput = step3.querySelector('.form-modal__time-grid-input');
      markInvalidField(firstSlotInput);
      return false;
    }

    return true;
  }

  function collectFormData() {
    // Step 1
    const propertyTypeValue =
      modal.querySelector('input[name="property-type"]:checked')?.value || null;
    const paintScopeValue =
      modal.querySelector('input[name="paint-scope"]:checked')?.value || null;
    const agreeChecked =
      modal.querySelector('input[name="agree"]')?.checked || false;

    // Step 2
    const firstNameValue =
      modal.querySelector('input[name="name"]')?.value.trim() || '';
    const lastNameValue =
      modal.querySelector('input[name="last-name"]')?.value.trim() || '';
    const emailValue =
      modal.querySelector('input[name="email"]')?.value.trim() || '';
    const phoneValue =
      modal.querySelector('input[name="phone"]')?.value.trim() || '';

    // Step 3
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const timeSelections = {};

    days.forEach((day) => {
      const checkedInput = modal.querySelector(
        `input[name="time[${day}]"]:checked`,
      );
      timeSelections[day] = checkedInput ? checkedInput.value : null;
    });

    return {
      project: {
        propertyType: propertyTypeValue,
        paintScope: paintScopeValue,
        agreeToTerms: agreeChecked,
      },
      contact: {
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        phone: phoneValue,
      },
      timeEstimate: timeSelections,
    };
  }

  function resetForm() {
    // Step 1: project info
    const propertyTypeHome = modal.querySelector(
      'input[name="property-type"][value="home"]',
    );
    const paintScopeExterior = modal.querySelector(
      'input[name="paint-scope"][value="exterior"]',
    );
    const agreeInput = modal.querySelector('input[name="agree"]');
    if (propertyTypeHome) propertyTypeHome.checked = true;
    if (paintScopeExterior) paintScopeExterior.checked = true;
    if (agreeInput) agreeInput.checked = false;

    // Step 2: contact fields
    const nameInput = modal.querySelector('input[name="name"]');
    const lastNameInput = modal.querySelector('input[name="last-name"]');
    const emailInput = modal.querySelector('input[name="email"]');
    const phoneInput = modal.querySelector('input[name="phone"]');
    if (nameInput) nameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';

    // Step 3: time grid – set morning for each day
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    days.forEach((day) => {
      const morningRadio = modal.querySelector(
        `input[name="time[${day}]"][value="morning"]`,
      );
      if (morningRadio) morningRadio.checked = true;
    });

    steps.forEach((step) => clearStepErrors(step));
  }

  function showStep(index) {
    steps.forEach((step, stepIndex) => {
      if (stepIndex === index) {
        step.classList.add('form-modal__step--active');
        clearStepErrors(step);
      } else {
        step.classList.remove('form-modal__step--active');
      }
    });
    currentStepIndex = index;
  }

  function openModal() {
    modal.classList.add('form-modal--open');
    showStep(0);
    setBodyScrollLocked(true);
  }

  function closeModal() {
    modal.classList.remove('form-modal--open');
    setBodyScrollLocked(false);
  }

  // Open modal when clicking any button on the site, except buttons inside the modal
  const allButtons = Array.from(document.querySelectorAll('button'));
  allButtons.forEach((button) => {
    if (modal.contains(button)) return;

    button.addEventListener('click', () => {
      openModal();
    });
  });

  // Close handlers
  overlay?.addEventListener('click', () => {
    closeModal();
  });

  closeButton?.addEventListener('click', () => {
    closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('form-modal--open')) {
      closeModal();
    }
  });

  // Step navigation
  const step1Next = step1?.querySelector('.form-modal__next');
  const step2Back = step2?.querySelector('.form-modal__next.back');
  const step2Next = step2?.querySelector(
    '.form-modal__next:not(.back)',
  );
  const step3Back = step3?.querySelector('.form-modal__next.back');
  const step3Send = step3?.querySelector(
    '.form-modal__next:not(.back)',
  );
  const step4Close = step4?.querySelector('.form-modal__next');

  // Prevent default submit on internal forms (we handle steps manually)
  step1Form?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  step2Form?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  step1Next?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!validateStep1()) return;
    showStep(1);
  });

  step2Back?.addEventListener('click', (event) => {
    event.preventDefault();
    showStep(0);
  });

  step2Next?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!validateStep2()) return;
    showStep(2);
  });

  step3Back?.addEventListener('click', (event) => {
    event.preventDefault();
    showStep(1);
  });

  step3Send?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!validateStep3()) return;

    const payload = collectFormData();
    // Simulated request payload
    console.log('EverFresh form modal payload:', payload);

    resetForm();
    showStep(3);
  });

  step4Close?.addEventListener('click', (event) => {
    event.preventDefault();
    closeModal();
  });
}

updateCurrentYear();
initBeforeAfterSlider();
initReviewsSlider();
initWorkSlider();
initFormModal();
