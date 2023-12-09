// CHANGE THIS VARIABLE TO TRUE ONLY WHEN API IS TO BE USED
const useAPI = false;

const rainForestApiKey = "D961BC3F959A416CB66BA38ED853CB39";

// The below API endpoint is used for acquiring an amazon search listing of products
const baseListingURL = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=search&amazon_domain=amazon.com`;

// The below API endpoint is used for viewing an individual product listing
const baseProductURL = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=product`;

// Destructure the array containing our two <select> tags. This will break if the number of selects were to change!
const [productSelect, categorySelect] = document.querySelectorAll("select");

// The product url input element
const urlPromptEl = document.getElementById("product-url");

// Hide the url prompt upon first start
toggleUrlInput();

/*
Returns a boolean (true / false) for whether or not they have a product in mind to use as
inspiration. The user is expected to drop a URL into the form below 'paste you url here'
*/
function doesUserHaveProductInMind() {
  return (productSelect.options[productSelect.selectedIndex].value === "1");
}

// Display the url prompt when the user has selected "yes" they do have a product in mind
// Hide the url prompt when the user has selected "no" they don't have a product in mind
function toggleUrlInput() {
  if (doesUserHaveProductInMind()) {
    urlPromptEl.parentElement.style.display = "block";
  } else {
    urlPromptEl.parentElement.style.display = "none";
  }
}

// Hide/display the url prompt whenever the select element for "a product in mind" has been
// selected
productSelect.addEventListener("change", function(event) {
  toggleUrlInput();
})

/*
Returns the url string if the user has selected 'yes' to the do they have a product in mind
select. 
*/
function getInMindProductUrl() {
  return document.getElementById("product-url");
}

// Returns the price range from the slider 
function getPriceRange() {
  return document.getElementById("price-range").value;
}

// Returns boolean of whether the 'Prime delivery available' checkbox is checked or not
function isPrimeDelivery() {
  return document.getElementById("prime-delivery").checked;
}

// returns the selected category's specific amazon category id
// appended to our query by: category_id=getCategories()
// If no catgeory was selected at submit time an empty string will be returned
function getCategory() {
  var e = document.getElementById("product-categories");
  return e.options[e.selectedIndex].value;
}

// Each chip tag will be added to our query in the `search_term` parameter
// For example: 2 chips with "memory cards" "64GB" will be appended to
// our fetch request as &search_term=memory%20cards+64gb
//
// Each keyword is added to a global set which is constantly modified as
// the user
var keywords = new Set();
document.addEventListener("DOMContentLoaded", function () {
  // Initialize our select menus
  var instances = M.FormSelect.init(document.querySelectorAll('select'), {});

  var elems = document.querySelectorAll(".chips");

  function sanitizeTag(tag) {
    return tag.replace(/\s/g, '%20').trim().toLowerCase();
  }

  var instances = M.Chips.init(elems, {
    onChipAdd: function(elem, addedChip) {
      var addedChipTag = addedChip.textContent.replace('close', '');
      console.log("Added a chip tag:", addedChipTag);
      keywords.add(sanitizeTag(addedChipTag));
    },
    onChipDelete: function(elem, deletedChip) {
      var deletedChipTag = deletedChip.textContent.replace('close', '');
      console.log(`Deleted a chip tag: ${deletedChipTag}`);
      keywords.delete(sanitizeTag(deletedChipTag));
    }
  });
});

/*
  Using the parameters provided, create a product listing query for the rainforest
  API
*/
function buildQueryUrl(keywords, category) {
  let queryURL = baseListingURL;
  if (keywords.size) {
    queryURL += `&search_term=${Array.from(keywords).join('+')}`
  }
  var categoryId = getCategory();
  if (categoryId) {
    queryURL += `&category_id=${categoryId}`;
  }
  console.log("Product listing query URL constructed: ", queryURL);
  return queryURL; 
}

/*
  Build a product search query url from the parameters selected by the user.
  *if* a product url was provided, we use the product category, keywords, etc.
  from that product as defaults.

  This product search query url is passed to a new fetch request that parses
  data and performs sentiment analysis (script2.js)
*/
async function passSearchQueryToCallback(callback) {

  // Below will only run when API use is allowed
  if (doesUserHaveProductInMind && useAPI) {
    console.log("User has a product in mind")
    var queryUrl = `${baseProductURL}&url=${getInMindProductUrl()}`;
    
    fetch(queryUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(data) {
      console.log("Data from fetch request of the product in mind:");
      console.log(data);

      var asin = data.product.asin;
      var queryKeywords = data.product.keywords_list;
      var queryCategory = data.product.categories[1].category_id;
      var isPrime = data.product.buybox_winner.is_prime;
      var price = data.product.buybox_winner.price-value;

      if (!queryCategory) {
        queryCategory = getCategory();
      }

      if (!isPrime) {
        isPrime = isPrimeDelivery();
      }

      // A search query for a user with an inspired product:
      buildQueryUrl(queryKeywords, queryCategory)

    });
  } else {
    callback(buildQueryUrl(keywords, getCategory()));
  }
}

// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();

  // Temp empty callback function:
  passSearchQueryToCallback(function(){});
});
