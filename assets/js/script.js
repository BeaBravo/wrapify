const rainForestApiKey = "D961BC3F959A416CB66BA38ED853CB39";

// The below API endpoint is used for acquiring an amazon search listing of products
const baseListingURL = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=search&amazon_domain=amazon.com`;

// The below API endpoint is used for viewing an individual product listing
const baseProductURL = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=product&amazon_domain=`;

/*
Returns a boolean (true / false) for whether or not they have a product in mind to use as
inspiration. The user is expected to drop a URL into the form below 'paste you url here'
*/
function doesUserHaveProductInMind() {
  var e = document.querySelectorAll("select")[0];
  return (e.options[e.selectedIndex].value === "1");
}

/*
Returns the url string if the user has selected 'yes' to the do they have a product in mind
select. 
*/
function getInMindProductUrl() {
  return document.getElementById("product-url");
}

// Initialize our select menus
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});


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
// For example: 2chips with "memory cards" "64GB" will be appended to
// our fetch request as &search_term=memory%20cards+64gb
//
// Each keyword is added to a global set which is constantly modified as
// the user
var keywords = new Set();
document.addEventListener("DOMContentLoaded", function () {
  
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

function createQuery() {
  let queryURL = baseListingURL;

  if (keywords.size) {
    queryURL += `&search_term=${Array.from(keywords).join('+')}`
  }

  var categoryId = getCategory();
  if (categoryId) {
    queryURL += `&category_id=${categoryId}`;
  }
  console.log("Query URL constructed: ", queryURL);
  return queryURL;
}

// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();
  var queryObject = {
    url: createQuery(),
    is_prime: isPrimeDelivery(),
    price_range: getPriceRange()
  }
  console.log(getInMindProductUrl());
  return queryObject;

});
