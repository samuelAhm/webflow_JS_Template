import flatpickr from 'flatpickr';

export const datePicker = (dateInput: string) => {
  const input = flatpickr(dateInput, {});

  return input;
};

type ProductNameValue = {
  [key: string]: number;
};

const productNameValue: ProductNameValue = {
  'invalidity-prior-art-search': 1350,
  'state-of-the-art-search': 1000,
  'patentability-search': 2500,
  'infringement-search': 1000,
  'product-infringement': 2000,
};

export function formatDateWithDashes(dateNumber: number) {
  // Convert the number to a string
  const dateString = dateNumber.toString();

  // Extract year, month, and day using substring
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // Return the formatted date with dashes
  return `${year}-${month}-${day}`;
}

export const populateFormSummary = (formData: HTMLFormElement) => {
  const priceWrapper = document.querySelector('[total-price]') as HTMLElement;
  const titleWrap = document.querySelector('[product-name]') as HTMLElement;

  //get form data
  const formDataObject = new FormData(formData);
  //convert fom data to object

  const productName = formDataObject.get('product-selection') as string;

  const basePrice = productNameValue[productName];

  titleWrap.textContent = productName;

  //const basePrice = 1350;

  const getAdditionalPrice = formDataObject.get('npl-included') ? 750 : 0;

  const finalPrice = basePrice + getAdditionalPrice;

  //format the price to 1,000
  priceWrapper.textContent = `${finalPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} `;

  //priceWrapper.textContent = `$${finalPrice}$`;

  //all summary Parents Elements
  const summaryParents = [...document.querySelectorAll('[data-summary]')] as HTMLElement[];
  // Loop through all summary elements
  summaryParents.forEach((summaryElement) => {
    const fieldName = summaryElement.getAttribute('data-summary') as string;
    const fieldValue = formDataObject.get(fieldName) as string;

    if (fieldValue && fieldValue.trim()) {
      // If the field has a value, show the summary element
      summaryElement.style.display = 'block';
      // Update the summary content
      const summaryValueElement = summaryElement.querySelector('[text-wrap]');
      if (summaryValueElement) {
        summaryValueElement.textContent = fieldValue;
      }
    } else {
      // If the field is empty, hide the summary element
      summaryElement.style.display = 'none';
    }
  });

  //   //get the patent number
  //   const patentNumber = formDataEntries.find((entry) => entry[0] === 'patent-number--input');
};
