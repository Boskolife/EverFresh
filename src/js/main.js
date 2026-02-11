import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'animate.css/animate.min.css';
import WOW from 'wow.js/src/WOW.js';
import emailjs from '@emailjs/browser';

// EmailJS: replace with your Service ID, Template ID and Public Key from https://dashboard.emailjs.com
// In your EmailJS template you can use: {{firstName}}, {{lastName}}, {{email}}, {{phone}},
// {{propertyType}}, {{paintScope}}, {{agreeToTerms}}, {{timeSlots}}
const EMAILJS_CONFIG = {
  serviceId: 'service_dm9hgzq',
  templateId: 'template_tlbt2jd',
  publicKey: 'SEJTSu6oVslp_spJe',
};

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
  const steps = Array.from(modal.querySelectorAll('.form-modal__step'));

  if (!steps.length) return;

  const step1 = modal.querySelector('.form-modal__step-1');
  const step2 = modal.querySelector('.form-modal__step-2');
  const step3 = modal.querySelector('.form-modal__step-3');
  const step4 = modal.querySelector('.form-modal__step-4');

  const step1Form = step1?.querySelector('form');
  const step2Form = step2?.querySelector('form');

  // Restrict phone input to digits and common symbols only (no letters)
  const phoneInput = modal.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      const allowed = /[\d\s+\-()]/g;
      const filtered = (this.value.match(allowed) || []).join('');
      if (this.value !== filtered) {
        this.value = filtered;
      }
      updateStepButtons();
    });
  }

  // Add event listeners for Step 1 validation
  if (step1) {
    const propertyTypeInputs = step1.querySelectorAll(
      'input[name="property-type"]',
    );
    const paintScopeInputs = step1.querySelectorAll(
      'input[name="paint-scope"]',
    );
    const agreeInput = step1.querySelector('input[name="agree"]');

    propertyTypeInputs.forEach((input) => {
      input.addEventListener('change', updateStepButtons);
    });
    paintScopeInputs.forEach((input) => {
      input.addEventListener('change', updateStepButtons);
    });
    if (agreeInput) {
      agreeInput.addEventListener('change', updateStepButtons);
    }
  }

  // Add event listeners for Step 2 validation
  if (step2) {
    const firstNameInput = step2.querySelector('input[name="name"]');
    const lastNameInput = step2.querySelector('input[name="last-name"]');
    const emailInput = step2.querySelector('input[name="email"]');

    if (firstNameInput) {
      firstNameInput.addEventListener('input', updateStepButtons);
      firstNameInput.addEventListener('blur', updateStepButtons);
    }
    if (lastNameInput) {
      lastNameInput.addEventListener('input', updateStepButtons);
      lastNameInput.addEventListener('blur', updateStepButtons);
    }
    if (emailInput) {
      emailInput.addEventListener('input', updateStepButtons);
      emailInput.addEventListener('blur', updateStepButtons);
    }
    if (phoneInput) {
      phoneInput.addEventListener('blur', updateStepButtons);
    }
  }

  // Add event listeners for Step 3 validation
  if (step3) {
    const timeGridInputs = step3.querySelectorAll(
      '.form-modal__time-grid-input',
    );
    timeGridInputs.forEach((input) => {
      input.addEventListener('change', updateStepButtons);
    });
  }

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

    const propertyTypeFirst = step1.querySelector(
      'input[name="property-type"]',
    );
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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showStepError(
        step2,
        'Please enter a valid email address (e.g. name@example.com).',
      );
      markInvalidField(emailInput);
      return false;
    }

    if (!phoneInput.value.trim()) {
      showStepError(step2, 'Please enter your phone number.');
      markInvalidField(phoneInput);
      return false;
    }

    const phoneDigitsOnly = phoneInput.value.replace(/\D/g, '');
    const minPhoneDigits = 9;
    if (phoneDigitsOnly.length < minPhoneDigits) {
      showStepError(
        step2,
        'Please enter a valid phone number (at least 9 digits).',
      );
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
      const firstSlotInput = step3.querySelector(
        '.form-modal__time-grid-input',
      );
      markInvalidField(firstSlotInput);
      return false;
    }

    return true;
  }

  // Check validation without showing errors (for button state)
  function checkStep1Valid() {
    if (!step1) return false;
    const propertyTypeChecked = step1.querySelector(
      'input[name="property-type"]:checked',
    );
    const paintScopeChecked = step1.querySelector(
      'input[name="paint-scope"]:checked',
    );
    const agreeInput = step1.querySelector('input[name="agree"]');
    return (
      propertyTypeChecked &&
      paintScopeChecked &&
      agreeInput &&
      agreeInput.checked
    );
  }

  function checkStep2Valid() {
    if (!step2) return false;
    const firstNameInput = step2.querySelector('input[name="name"]');
    const lastNameInput = step2.querySelector('input[name="last-name"]');
    const emailInput = step2.querySelector('input[name="email"]');
    const phoneInput = step2.querySelector('input[name="phone"]');

    if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput) {
      return false;
    }

    if (!firstNameInput.value.trim() || !lastNameInput.value.trim()) {
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      return false;
    }

    const phoneDigitsOnly = phoneInput.value.replace(/\D/g, '');
    if (phoneDigitsOnly.length < 9) {
      return false;
    }

    return true;
  }

  function checkStep3Valid() {
    if (!step3) return false;
    const checkedInputs = step3.querySelectorAll(
      '.form-modal__time-grid-input:checked',
    );
    return checkedInputs.length > 0;
  }

  // Update button disabled state based on validation
  function updateStepButtons() {
    if (currentStepIndex === 0) {
      if (step1Next) {
        step1Next.disabled = !checkStep1Valid();
      }
    } else if (currentStepIndex === 1) {
      if (step2Next) {
        step2Next.disabled = !checkStep2Valid();
      }
    } else if (currentStepIndex === 2) {
      if (step3Send) {
        step3Send.disabled = !checkStep3Valid();
      }
    }
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

  // Flatten form data for EmailJS template variables (e.g. {{firstName}}, {{email}}, {{timeSlots}})
  function buildEmailJSParams(payload) {
    const dayLabels = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
    };
    const slotLabels = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
    };
    const timeParts = [];
    Object.entries(payload.timeEstimate || {}).forEach(([day, slot]) => {
      if (slot) {
        timeParts.push(`${dayLabels[day] || day}: ${slotLabels[slot] || slot}`);
      }
    });
    return {
      firstName: payload.contact?.firstName ?? '',
      lastName: payload.contact?.lastName ?? '',
      email: payload.contact?.email ?? '',
      phone: payload.contact?.phone ?? '',
      propertyType: payload.project?.propertyType ?? '',
      paintScope: payload.project?.paintScope ?? '',
      agreeToTerms: payload.project?.agreeToTerms ? 'Yes' : 'No',
      timeSlots: timeParts.join('; ') || '—',
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
    updateStepButtons();
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

  // Open modal when clicking buttons with data-modal="open" or data-open-modal attribute
  // Excludes buttons inside the modal and location buttons
  const modalButtons = Array.from(
    document.querySelectorAll('button[data-modal="open"], button[data-open-modal]'),
  );
  modalButtons.forEach((button) => {
    if (modal.contains(button)) return;
    if (button.closest('.locations')) return;

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
    if (
      event.key === 'Escape' &&
      modal.classList.contains('form-modal--open')
    ) {
      closeModal();
    }
  });

  // Step navigation
  const step1Next = step1?.querySelector('.form-modal__next');
  const step2Back = step2?.querySelector('.form-modal__next.back');
  const step2Next = step2?.querySelector('.form-modal__next:not(.back)');
  const step3Back = step3?.querySelector('.form-modal__next.back');
  const step3Send = step3?.querySelector('.form-modal__next:not(.back)');
  const step4Close = step4?.querySelector('.form-modal__next');

  // Initialize button states after buttons are defined
  updateStepButtons();

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
    const templateParams = buildEmailJSParams(payload);
    const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

    if (
      !serviceId ||
      !templateId ||
      !publicKey ||
      serviceId === 'YOUR_SERVICE_ID'
    ) {
      console.warn(
        'EverFresh: EmailJS not configured. Set EMAILJS_CONFIG in main.js.',
      );
      resetForm();
      showStep(3);
      return;
    }

    const sendButton = step3Send;
    const originalText = sendButton?.textContent;
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.textContent = 'Sending…';
    }
    clearStepErrors(step3);

    emailjs
      .send(serviceId, templateId, templateParams, { publicKey })
      .then(() => {
        resetForm();
        showStep(3);
      })
      .catch((err) => {
        showStepError(
          step3,
          'Something went wrong. Please try again or contact us directly.',
        );
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.textContent = originalText;
        }
        console.error('EverFresh EmailJS send failed:', err);
      });
  });

  step4Close?.addEventListener('click', (event) => {
    event.preventDefault();
    closeModal();
  });
}

function initWow() {
  // Attach animation classes from data-wow-animation attribute
  const animatedElements = document.querySelectorAll('[data-wow-animation]');
  animatedElements.forEach((element) => {
    const animationClass = element.getAttribute('data-wow-animation');
    if (animationClass && !element.classList.contains(animationClass)) {
      element.classList.add(animationClass);
    }
  });

  const wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animate__animated',
    offset: 24,
    mobile: true,
    live: true,
  });
  wow.init();
}

function initLocationsMap() {
  const locationsSection = document.querySelector('.locations');
  if (!locationsSection) return;

  const mapContainer = document.getElementById('locations-map');
  if (!mapContainer) return;

  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps) {
    console.warn(
      'Google Maps API is not loaded. Please add your API key in index.html',
    );
    return;
  }

  const buttons = locationsSection.querySelectorAll('.locations__btn');
  if (!buttons.length) return;

  // Location coordinates data
  const locationsData = {
    oakville: { lat: 43.4675, lng: -79.6877, name: 'Oakville' },
    burlington: { lat: 43.3255, lng: -79.799, name: 'Burlington' },
    mississauga: { lat: 43.589, lng: -79.6441, name: 'Mississauga' },
    hamilton: { lat: 43.2557, lng: -79.8711, name: 'Hamilton' },
    waterloo: { lat: 43.4643, lng: -80.5204, name: 'Waterloo' },
    guelph: { lat: 43.5448, lng: -80.2482, name: 'Guelph' },
    milton: { lat: 43.5183, lng: -79.8774, name: 'Milton' },
    stoneycreek: { lat: 43.2168, lng: -79.7597, name: 'Stoney Creek' },
    cambridge: { lat: 43.3616, lng: -80.3144, name: 'Cambridge' },
    kitchener: { lat: 43.4516, lng: -80.4925, name: 'Kitchener' },
  };

  // Snazzy Maps styles
  const mapStyles = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ffffff' }, { lightness: 17 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }, { lightness: 18 }],
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }, { lightness: 16 }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#dedede' }, { lightness: 21 }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#f2f2f2' }, { lightness: 19 }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [{ color: '#fefefe' }, { lightness: 20 }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }],
    },
  ];

  // Function to create custom marker icon with specified color and size
  function createMarkerIcon(color, size = 32) {
    // SVG path from location-marker.svg with color replacement
    const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C9.384 0 4 5.42133 4 12.0867C4 21.5573 14.872 31.336 15.3347 31.7467C15.5253 31.916 15.7627 32 16 32C16.2373 32 16.4747 31.916 16.6653 31.748C17.128 31.336 28 21.5573 28 12.0867C28 5.42133 22.616 0 16 0ZM16 18.6667C12.324 18.6667 9.33333 15.676 9.33333 12C9.33333 8.324 12.324 5.33333 16 5.33333C19.676 5.33333 22.6667 8.324 22.6667 12C22.6667 15.676 19.676 18.6667 16 18.6667Z" fill="${color}"/>
      <path d="M15.1667 14.5001V14.0001H13.5C13.3167 14.0001 13.15 13.9267 13.03 13.8034C12.9067 13.6834 12.8334 13.5167 12.8334 13.3334C12.8334 12.9901 13.1 12.7034 13.4367 12.6701C13.4567 12.6667 13.4767 12.6667 13.5 12.6667H18.5C18.5234 12.6667 18.5434 12.6667 18.5634 12.6701C18.7234 12.6834 18.8634 12.7534 18.97 12.8634C19.1067 12.9967 19.18 13.1867 19.1634 13.3934C19.1334 13.7434 18.8167 14.0001 18.4634 14.0001H16.8334V14.5001C16.8334 14.9601 16.46 15.3334 16 15.3334C15.54 15.3334 15.1667 14.9601 15.1667 14.5001Z" fill="${color}"/>
      <path d="M17.7298 8.66675H16.4165C16.3232 8.66675 16.2498 8.74008 16.2498 8.83341V9.33341C16.2498 9.47008 16.1365 9.58341 15.9998 9.58341C15.9698 9.58341 15.9432 9.57675 15.9165 9.56675C15.8198 9.53341 15.7498 9.44008 15.7498 9.33341V8.83341C15.7498 8.74008 15.6765 8.66675 15.5832 8.66675H15.0798C14.9865 8.66675 14.9132 8.74008 14.9132 8.83341V10.3334C14.9132 10.4701 14.7998 10.5834 14.6632 10.5834C14.5265 10.5834 14.4132 10.4701 14.4132 10.3334V9.58341V8.83341C14.4132 8.74341 14.3465 8.67341 14.2565 8.66675H14.2465C13.6665 8.68008 13.2165 9.18341 13.2765 9.76675L13.3998 12.0167C13.4098 12.1934 13.5565 12.3334 13.7332 12.3334H18.2665C18.4432 12.3334 18.5898 12.1934 18.5998 12.0167L18.7232 9.76675C18.7832 9.17675 18.3198 8.66675 17.7298 8.66675Z" fill="${color}"/>
    </svg>`;

    const encodedSvg = encodeURIComponent(svgString);
    const anchorX = size / 2;
    const anchorY = size;
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodedSvg}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(anchorX, anchorY),
    };
  }

  // Initialize map centered on Hamilton (default active location)
  const defaultLocation = locationsData.hamilton;
  const map = new google.maps.Map(mapContainer, {
    zoom: 9,
    center: { lat: defaultLocation.lat, lng: defaultLocation.lng },
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  // Create markers for all locations
  const markers = {};
  Object.keys(locationsData).forEach((locationId) => {
    const location = locationsData[locationId];
    const isActive = locationId === 'hamilton';
    const markerSize = isActive ? 40 : 32; // Active marker is larger
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.name,
      visible: true, // Show all markers
      icon: createMarkerIcon(isActive ? '#F6734C' : '#333333', markerSize),
    });

    // Info window for marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding: 8px; font-weight: 600; color: #333;">${location.name}</div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    markers[locationId] = marker;
  });

  // Button click handlers
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const locationId = button.getAttribute('data-location');
      if (!locationId || !locationsData[locationId]) return;

      const location = locationsData[locationId];

      // Remove active class from all buttons
      buttons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });

      // Add active class to clicked button
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      // Update all markers: set inactive ones to black (small), active to orange (large)
      Object.keys(markers).forEach((id) => {
        const isActive = id === locationId;
        const markerSize = isActive ? 40 : 32; // Active marker is larger
        markers[id].setIcon(
          createMarkerIcon(isActive ? '#F6734C' : '#333333', markerSize),
        );
      });

      // Center map on selected location
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(9);
    });
  });
}

updateCurrentYear();
initBeforeAfterSlider();
initReviewsSlider();
initWorkSlider();
initFormModal();
initWow();

// Initialize Google Maps when API is loaded
function initMapsWhenReady() {
  if (typeof google !== 'undefined' && google.maps && google.maps.marker) {
    initLocationsMap();
  } else {
    // Wait for Google Maps API to load
    window.addEventListener('load', () => {
      if (typeof google !== 'undefined' && google.maps && google.maps.marker) {
        initLocationsMap();
      } else {
        // Fallback: check periodically
        const checkInterval = setInterval(() => {
          if (
            typeof google !== 'undefined' &&
            google.maps &&
            google.maps.marker
          ) {
            initLocationsMap();
            clearInterval(checkInterval);
          }
        }, 100);
        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    });
  }
}

// Suppress CSP test errors (they are non-critical)
window.addEventListener(
  'error',
  (event) => {
    if (
      event.message &&
      event.message.includes('gen_204') &&
      event.message.includes('csp_test')
    ) {
      event.preventDefault();
      return false;
    }
  },
  true,
);

initMapsWhenReady();
