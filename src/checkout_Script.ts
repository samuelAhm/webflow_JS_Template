const options: RequestInit = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  referrer: '',
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

//titleWrap.textContent = productName;

export function createPayload(formEl: HTMLFormElement, selectedClaims: []) {
  const getFormData = new FormData(formEl);
  const formDataObject = Object.fromEntries(getFormData.entries());

  const productName = getFormData.get('product-selection') as string;

  console.log(formDataObject);
  console.log(selectedClaims);

  const basePrice = productNameValue[productName];

  // const basePrice = 1300;
  const getAdditionalPrice = getFormData.get('npl-included') ? 750 : 0;

  const finalPrice = basePrice + getAdditionalPrice;

  //convert finalprice to cents
  const finalPriceCents = finalPrice * 100;

  //format the price to 1,000
  const priceAMount = `${finalPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} `;

  // Define the stripe_item object
  const stripe_item = {
    price_data: {
      currency: 'usd',
      product_data: { name: formDataObject['product-selection'], description: '-' },
      unit_amount: finalPriceCents, // Amount in cents ($2000.00)
    },
    quantity: 1,
  };

  // Construct the payLoadData object
  const payLoadData = {
    assignee: formDataObject.assignee || '',
    claim_focus: formDataObject.claim_focus || '',
    classification: formDataObject.classification || '',
    date: formDataObject.date || '',
    email: formDataObject.email || '',
    first_name: formDataObject.fName || '',
    industry: formDataObject.industry || '',
    infringement_jurisdiction_selection: formDataObject.infringement_jurisdiction_selection || '',
    infringement_patent_search_option: formDataObject.infringement_patent_search_option || null,
    inventor: formDataObject.inventor || '',
    jurisdiction: formDataObject.jurisdiction || '',
    jurisdiction_type: formDataObject.jurisdiction_type || '',
    language_instruction: formDataObject.language_instruction || '',
    last_name: formDataObject.lName || '',
    market_players: formDataObject.market_players || '',
    npl_included: formDataObject['npl-included'] === 'on', // Convert checkbox value to boolean
    other: formDataObject.other || '',
    patent_number: formDataObject.patent_number || 'US-7226536-B2',
    priority_date: formDataObject['priority-date'] || '',
    product_name: formDataObject['product-selection'] || '',
    product_price: priceAMount,
    search_time_period: formDataObject.search_time_period || 'before-this-date',
    selected_claims: selectedClaims, // Use the pre-fetched selected_claims
    stripe_cancel_url: 'https://supercharger-site-b5d0440033ddb070d8c44.webflow.io/product-js',
    stripe_line_items: [stripe_item],
    stripe_success_url: 'https://supercharger-site-b5d0440033ddb070d8c44.webflow.io/order-success',
    technology_description: formDataObject.technology_description || '',
  };

  return payLoadData;
}

export const checkOutAPI = async function (payLoad: any, checkoutBtn: HTMLElement) {
  try {
    const response = await fetch(
      `https://xobg-f2pu-pqfs.n7.xano.io/api:Qn7okCDL/home/create-stripe-checkout`,
      {
        ...options,
        body: JSON.stringify(payLoad),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const { stripe_checkout_url } = data;
    checkoutBtn.classList.remove('is-loading');
    //redirect to the stripe checkout
    window.location.href = stripe_checkout_url;

    //display the results
    //get the abstract
  } catch (error) {
    console.log(error);
  }
};

/*
classification
: 
""
email
: 
"m@m.co"
fName
: 
"d"
inventor
: 
""
jurisdiction-type
: 
"the-big-five"
lName
: 
"s"
npl-included
: 
"on"
others
: 
""
patent-number
: 
"US-7226536-B2"
potential-assignees
: 
""
priority-date
: 
"2005-04-21"
product-selection
: 
"invalidity-prior-art-search"

*/

// const stripe_item = {
//   price_data: {
//     currency: 'usd',
//     product_data: { name: 'Product Infringement', description: '-' },
//     unit_amount: 200000,
//   },
//   quantity: 1,
// };

// const payLoadData = {
//   assignee: '',
//   claim_focus: '',
//   classification: '',
//   date: '',
//   email: '',
//   first_name: '',
//   industry: '',
//   infringement_jurisdiction_selection: '',
//   infringement_patent_search_option: null,
//   inventor: '',
//   jurisdiction: '',
//   jurisdiction_type: '',
//   language_instruction: '',
//   last_name: '',
//   market_players: '',
//   npl_included: false,
//   other: '',
//   patent_number: 'US-7226536-B2',
//   priority_date: '',
//   product_name: 'PRODUCT INFRINGEMENT',
//   product_price: '$2000.00',
//   search_time_period: 'before-this-date',
//   selected_claims: [{}],
//   stripe_cancel_url: 'https://supercharger-site-b5d0440033ddb070d8c44.webflow.io/',
//   stripe_line_items: [stripe_item],
//   stripe_success_url: 'https://supercharger-site-b5d0440033ddb070d8c44.webflow.io/order-success',
//   technology_description: '',
// };
