// CHANGE THIS VARIABLE TO TRUE ONLY WHEN API IS TO BE USED
const useAPI = false;

const rainForestApiKey = "D961BC3F959A416CB66BA38ED853CB39";

// The below API endpoint is used for acquiring an amazon search listing of products
const baseListingUrl = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=search&amazon_domain=amazon.com`;

// The below API endpoint is used for viewing an individual product listing
const baseProductUrl = `https://api.rainforestapi.com/request?api_key=${rainForestApiKey}&type=product`;

// Destructure the array containing our two <select> tags. This will break if the number of selects were to change!
const [productSelect, categorySelect] = document.querySelectorAll("select");

// The product url input element
const urlPromptEl = document.getElementById("product-url");

// Hide the url prompt upon first start
//toggleUrlInput();

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
  return document.getElementById("product-url").value;
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

// Reset various parameters on the page so that the user can look for a new product
function resetPage() {
  // Hide the URL input upon page start / initial load
  urlPromptEl.parentElement.style.display = "none";

  // Clear any previously input URL's
  document.getElementById("product-url").value = "";
  
  // Reset the "Do you have a product in mind?" product select
  productSelect.selectedIndex = 0;

  // Chips are automatically deleted but the keywords they added to our global
  // keywords list are not. We manually clear the keywords set instead:
  keywords.clear();  
}

resetPage();

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

// Given this functions' parameters, build a query URL to the Rainforest API
// for the purpose of viewing a search listing of products
function buildSearchUrl(search_term, category_id) {
  let queryURL = baseListingUrl;
  if (search_term) {
    queryURL += `&search_term=${Array.from(search_term).join('+')}`;
  }
  if (category_id) {
    queryURL += `&category_id=${category_id}`;
  }
  return queryURL;
}

// Given a url to an amazon product, build a query URL to the Rainforest API
// for the purpose of viewing information about a specific product
function buildProductUrl(url) {
  return `${baseProductUrl}&url=${url}`;
}

// Get a rainforest query URL for viewing a product's information based on its
// ASIN number
function buildAsinUrl(asin) {
  return `${baseProductUrl}&amazon_domain=amazon.com&asin=${asin}`;
}

// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();
  //renderLoader();
  runSearch(viewProductInfo);
  //removeLoader();
});

// Delete the loader and its associated HTML when all fetch requests have been made
function removeLoader() {
  // reset the opacity so the screen is no longer blurred
  document.getElementsByClassName("custom-container")[0].style.opacity = 1;

  // Delete the loader if it is presently on the screen:
  var loaderEl = document.getElementsByClassName("preloader-wrapper")[0];
  if (loaderEl) {
    loaderEl.remove();
  }
}

// Render a loader in the center of the input form while fetch requests are being made
function renderLoader() {
  var container = document.getElementsByClassName("custom-container")[0];
  var loaderEl = document.createElement("div");
  loaderEl.classList.add("preloader-wrapper");
  loaderEl.classList.add("active");
  loaderEl.innerHTML = `
  <div class="spinner-layer spinner-red-only">
    <div class="circle-clipper left">
      <div class="circle"></div>
    </div>
    <div class="gap-patch">
      <div class="circle"></div>
    </div>
    <div class="circle-clipper right">
      <div class="circle"></div>
    </div>
  </div>
  `;
  /*
  // The below should be translated to CSS

  container.style.opacity = 0.3; // blur the form container while loading
  loaderEl.style.position = "absolute";
  var rect = container.getBoundingClientRect();

  // Place the loader in the middle of the container by
  // averaging the left and right x coordinates and the top
  // and bottom y coordinates
  loaderEl.style.left = `${(rect.right + rect.left) / 2}px`;
  loaderEl.style.top = `${(rect.bottom + rect.top) / 2}px`;
  loaderEl.style.zIndex = 1;
  */
  
  container.appendChild(loaderEl);

}

/*
  Build a rainforest API product search fetch request based on input parameters
  as well as a potential inspiration product. The data from this fetch request
  is passed to the `productViewer` callback after the data has been formatted
*/
function runSearch(productViewer) {

  // Below will only run when API use is allowed
  if (doesUserHaveProductInMind() && useAPI) {
    var queryUrl = buildProductUrl(getInMindProductUrl());
    console.log("User has product in mind: ", queryUrl);
    
    fetch(queryUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(data) {
      if (!data.request_info.success) {
        console.log("Error in runSearch function when attempting to fetch information about the users' product in mind: ");
        console.log(data.request_info.message);
      }
      console.log("Data from fetch request of the product in mind:");
      console.log(data);

      // Set object containing keywords about the users' product in mind
      var queryKeywords = new Set();

      // Below nested for loop combines all the keywords parsed from the users'
      // product in mind as well as any keyword chips they may have provided.
      // Furthermore, any 1 or 2 character keywords are dropped since they are
      // more likely to pollute our search result than to helps us find quality
      // products
      for (const keywordIterable of [data.product.keywords_list, keywords]) {
        for (const keyword of keywordIterable) {
          if (keyword.length < 3) {
            // Even though the word 'no' is 2 characters long. Having negation
            // as a keyword *could* be important so we add it to the queryKeywords
            // set - for now
            if (keyword !== "no") {
              continue;
            }
          }
          // Some "boring" words that often appear in keywords are skipped
          if (["for", "the", "with"].includes(keyword)) {
            continue;
          }
          queryKeywords.add(keyword);
        }
      }

      console.log("Keywords associated with this product: ", queryKeywords);

      /* The below switch statement handles extracting the category ID from the
      response.

      There are three unique circumstances handled here:

        1.) If there is no category associated with the product, we don't
            attempt to access a category from the categories array and instead
            attempt to use a category as selected on index.html

        2.) If there is only one category, we use the 0-index of the category
            array
        
        3.) If there is more than one category associated with a product, we use
            1-index of the category array. This index tends to be the most
            relevant catgeory associated with a product.
      */
      var queryCategory;
      switch (data.product.categories.length) {
        case 0:
          queryCategory = getCategory();
          break;
        case 1:
          queryCategory = data.product.categories[0].category_id;
          break;
        default:
          queryCategory = data.product.categories[1].category_id;
      }

      var isPrime = data.product.buybox_winner.is_prime;
      var price = data.product.buybox_winner.price.value;

      if (!isPrime) {
        isPrime = isPrimeDelivery();
      }

      // TODO: use set.union for queryKeywords and global keywords
      productViewer(buildSearchUrl(queryKeywords, queryCategory));
    });
  } else {
    // This code block runs when the user has no product in mind
    productViewer(buildSearchUrl(keywords, getCategory()));
  }
}

// --------------------------- Niel's code ----------------------------------
//AMAZON API
// queryURL -> rainforest API url query for a listing of products
// asinURL -> url for individual product information
function viewProductInfo(queryURL, maxSearchResults=1, maxComments=5) {
  // SEARCH LISTINGS API
  // USER JOURNEY 1
  fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (!data.request_info.success) {
      console.log("Received an error when attempting to do a product search: ");
      console.log(data.request_info.message);
      return;
    }
    console.log("Successfully did a product search! Received data: ", data);
    var resultsArray = [];

    // Use Math.min to make sure we iterate through at MOST 'maxSearchResults' number of products
    for (var i = 0; i < Math.min(data.search_results.length, maxSearchResults); i++) {
      var result = {
        title: data.search_results[i].title,
        prime_delivery: data.search_results[i].is_prime,
        asin: data.search_results[i].asin,
        image: data.search_results[i].image,
        rating: data.search_results[i].rating,
        price: data.search_results[i].price.raw,
        link: data.search_results[i].link,
        recentSales: data.search_results[i].recent_sales
      };

      console.log("Found a product: ", result);

      resultsArray.push(result);

      // Fetching reviews based on the asinURL
      fetch(buildAsinUrl(result.asin))
      .then(function (response2) {
        return response2.json();
      })
      .then(function (productData) {
        if (!productData.request_info.success) {
          console.log("An error occured when attempting to fetch data about this product: ");
          console.log(productData.request_info.message)
          return;
        }
        console.log("Data about the found product: ", productData);

        if (!productData.product.top_reviews.length) {
          console.log("Issue with the found product: No reviews to parse through");
          productData.product.top_reviews = [];
        }

        var reviewsArray = [];
        for (var j = 0; j < Math.min(productData.product.top_reviews.length, maxComments); j++) {
          var review = {
            body: productData.product.top_reviews[j].body,
            rating: productData.product.top_reviews[j].rating,
            isGlobal: productData.product.top_reviews[j].is_global_review,
          };
          reviewsArray.push(review);
        }
        console.log("Product reviews: ", reviewsArray);

        // Associating reviewsArray with the corresponding result

        result.reviews = reviewsArray;
        console.log("result object -> ", result);
        sentimentAnalysis(result.reviews, result);
        console.log("sentiment score from inside script.js -> ", result.sentiment_score);
      })
      .catch(function (error) {
        console.error(error);
      });
    }
    console.log("results inside script.js -> ", resultsArray);
    localStorage.setItem("results", JSON.stringify(resultsArray));
    //document.location.replace("./results-page.html");
  })
    // Now resultsArray contains the desired information for each search result, including reviews
    //console.log(resultsArray);
  .catch(function (error) {
    console.error(error);
  });
}