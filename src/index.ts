import 'swiper/css';

import Swiper from 'swiper';
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

import { checkOutAPI, createPayload } from './checkout_Script';
import { datePicker, formatDateWithDashes, populateFormSummary } from './helperFunction';
import { handleSwiperNavigation } from './swiper_nav_options';

// window.Webflow ||= [];
// window.Webflow.push(() => {
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('#superchargeForm', {
    modules: [Navigation, Pagination, EffectFade],
    effect: 'fade',
    allowTouchMove: false,
    slidesPerView: 1,
    autoHeight: true,
    // navigation: {
    //   // nextEl: nextButton,
    //   // prevEl: prevButton,
    //   // hiddenClass: 'hidden',
    // },
  });

  let selected_claims = [] as any;

  const formEl = document.querySelector('#wf-form-product--form') as HTMLFormElement;

  const nextButton = document.querySelector('.next-btn') as HTMLElement;
  const prevButton = document.querySelector('.prev-btn') as HTMLElement;

  const datePickerInput = document.querySelector('[patent-date--input]') as HTMLInputElement;

  //checkout btn
  const checkoutBtn = document.querySelector('[checkout--btn]') as HTMLElement;

  //data pickter input
  const datePickerInstance = datePicker('[patent-date--input]');

  handleSwiperNavigation(swiper, nextButton, prevButton, checkoutBtn);

  //patent input
  const patentInput = document.querySelector('[patent-number--input]') as HTMLInputElement;
  //patentInput.value = 'US-7226536-B2';
  //patent title and abstract
  const patentTitle = document.querySelector('[patent="title-data"]') as HTMLElement;
  const patentAbstract = document.querySelector('[patent="abstract-data"]') as HTMLElement;
  const patent_claims_wrapper = document.querySelector(
    '[patent-claims="container"]'
  ) as HTMLElement;

  const patent_api_container = document.querySelector(
    '[patent-api="resultwrapper"]'
  ) as HTMLElement;

  const patent_error = document.querySelector('[patent-state="error"]') as HTMLElement;
  //loader
  const loader = document.querySelector('[loading-state]') as HTMLElement;

  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    referrer: '',
  };

  //make API call to get patent record
  const getPatentRecord = async (patentID: string) => {
    try {
      const response = await fetch(
        `https://xobg-f2pu-pqfs.n7.xano.io/api:r7akEChV/searchByPublicationUpdated`,
        {
          ...options,
          body: JSON.stringify({ patentID: patentID, searchType: 'target' }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      //get the abstract title
      const abstractTitle = data.title;
      const abstractText = data.abstract;

      patentTitle.textContent = abstractTitle;
      patentAbstract.textContent = abstractText;

      //get the claims
      const { claims, priority_date } = data;
      datePickerInput.value = formatDateWithDashes(priority_date);

      const claimCheckBox = claims
        .map((claim) => {
          return `<div patent="claims-data" class="patent-claims_wrapper"><label class="w-checkbox patent-claims_checkbox-wrapper padding-top"><div class="w-checkbox-input w-checkbox-input--inputType-custom patent-claims_checkbox w--redirected-checked"></div><input type="checkbox" name="patent-claim-2" id="patent-claim-2" data-name="Patent Claim 2" style="opacity:0;position:absolute;z-index:-1"><span class="is-hidden w-form-label" for="patent-claim-2">Checkbox 4</span></label><div class="patent-claims_checkbox-content"><div class="patent-claim_text">${claim.value}</div><a wized="home_orderForm_priorArtPreview_claimReadMore" href="#" class="patent-claim_view-more is-hidden w-inline-block"><div wized="demo_selectTargetClaims_checkbox_readMoreText">Read More</div></a></div></div>`;
        })
        .join('');

      ///add to parent div
      patent_claims_wrapper.innerHTML = claimCheckBox;

      //show the  patent API container
      patent_api_container.style.display = 'block';
      patent_api_container.style.height = '100%';
      swiper.update();
      //remove loader
      loader.style.display = 'none';
      //display the results
      //get the abstract

      selected_claims = data;
      return data;
    } catch (error) {
      patent_error.style.display = 'block';
      patent_api_container.style.display = 'none';
      //hide loader
      loader.style.display = 'none';
      swiper.update();
    }
  };

  //interact with the form inputs
  const searchBtn = document.querySelector('[search-patent--btn]') as HTMLElement;

  //add validation before moving to next slide
  nextButton.addEventListener('click', function (event) {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const requiredFields = [
      ...currentSlide.querySelectorAll('input[required], select[required], textarea[required]'),
    ] as HTMLInputElement[];
    let isValid = true;
    ///check radio button of the same group
    requiredFields.forEach((field) => {
      if (field.type === 'radio') {
        // Handle radio buttons
        const radioGroup = currentSlide.querySelectorAll(`input[name="${field.name}"]`);

        const isRadioSelected = Array.from(radioGroup).some((radio) => radio.checked);

        if (!isRadioSelected) {
          isValid = false;
          radioGroup.forEach((radio) => radio.closest('label').classList.add('error')); // Add error class to labels
        } else {
          radioGroup.forEach((radio) => radio.closest('label').classList.remove('error'));
        }
      } else if (!field.value.trim()) {
        // Handle other required fields
        isValid = false;
        field.classList.add('error'); // Add error class for styling
      } else {
        field.classList.remove('error');
      }
    });

    if (!isValid) {
      event.preventDefault(); // Prevent moving to the next slide
      // alert('Please fill out all required fields.');
    } else {
      //populate the form summary
      if (swiper.activeIndex === 3) {
        populateFormSummary(formEl);
      }
      swiper.slideNext(); // Move to the next slide
    }
  });

  prevButton.addEventListener('click', function () {
    swiper.slidePrev(); // Move to the previous slide
  });

  //step 2 search btn
  //interact with the form inputs
  searchBtn.addEventListener('click', async function (event) {
    //get the patent number from the input
    const patentNumber = patentInput.value.trim();

    if (!patentNumber) {
      //add error class to the input
      patentInput.classList.add('error');
      // alert('Please enter a patent number.');
      return;
    }

    loader.style.display = 'flex';
    const patentRecord = await getPatentRecord(patentNumber);
  });

  ///checkout btn
  checkoutBtn.addEventListener('click', async function (event) {
    this.classList.add('is-loading');

    const checkOutPayload = createPayload(formEl, selected_claims);
    checkOutAPI(checkOutPayload, this);
  });
});
