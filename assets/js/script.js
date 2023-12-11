// CHANGE THIS VARIABLE TO TRUE ONLY WHEN API IS TO BE USED
const useAPI = true;

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
/*
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
*/
// Given this functions' parameters, build a query URL to the Rainforest API
// for the purpose of viewing a search listing of products
function buildSearchUrl(search_term, category_id) {
  let queryURL = baseListingURL;
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
  return `${baseProductURL}&url=${url}`;
}

// Get a rainforest query URL for viewing a product's information based on its
// ASIN number
function productUrlFromAsin(asin) {
  return `${baseProductURL}&amazon_domain=amazon.com&asin=${asin}`;
}

/*
  Build a product search query url from the parameters selected by the user.
  *if* a product url was provided, we use the product category, keywords, etc.
  from that product as defaults.

  This product search query url is passed to a new fetch request that parses
  data and performs sentiment analysis (script2.js)
*/
// var globalData = {};
// function getSearchQueryURL() {

//   // Below will only run when API use is allowed
//   if (doesUserHaveProductInMind() && useAPI) {
//     var queryUrl = `${baseProductURL}&url=${getInMindProductUrl()}`;
//     console.log("User has product in mind: ", queryUrl);
    
//     fetch(queryUrl)
//     .then(function(response) {
//       if (response.ok) {
//         return response.json();
//       }
//     })
//     .then(function(data) {
//       console.log("Data from fetch request of the product in mind:");
//       console.log(data);

//       var asin = data.product.asin;
//       var queryKeywords = data.product.keywords_list;

//       /* The below switch statement handles extracting the category ID from the
//       response.

//       There are three unique circumstances handled here:

//         1.) If there is no category associated with the product, we don't
//             attempt to access a category from the categories array.

//         2.) If there is only one category, we use the 0-index of the category
//             array
        
//         3.) If there is more than one category associated with a product, we use
//             1-index of the category array. This index tends to be the most
//             relevant catgeory associated with a product.
//       */
//       var queryCategory;
//       switch (data.product.categories.length) {
//         case 0:
//           break;
//         case 1:
//           queryCategory = data.product.categories[0].category_id;
//           break;
//         default:
//           queryCategory = data.product.categories[1].category_id;
//       }

//       var isPrime = data.product.buybox_winner.is_prime;
//       var price = data.product.buybox_winner.price.value;

//       if (!queryCategory) {
//         queryCategory = getCategory();
//       }

//       if (!isPrime) {
//         isPrime = isPrimeDelivery();
//       }

//       // A search query for a user with an inspired product:
//       globalData.queryURL = buildQueryUrl(queryKeywords, queryCategory);

//     });
//   } else {
//     globalData.queryURL = buildQueryUrl(keywords, getCategory());
//   }
// }

// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();

  // Sets our globalData variable's 'queryURL' property
  //getSearchQueryURL();
  //runSearch(viewProductInfo);
  viewSearch(viewProductInfo);

});

// Restructured version of getSearchQueryURL. Accepts a product viewing function
// as its argument
function viewSearch(productViewer) {

  // Below will only run when API use is allowed
  if (doesUserHaveProductInMind() && useAPI) {
    var queryUrl = `${baseProductURL}&url=${getInMindProductUrl()}`;
    console.log("User has product in mind: ", queryUrl);
    
    fetch(queryUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(data) {
      if (!data.request_info.success) {
        console.log("Error in viewSearch function when attempting to fetch information about the users' product in mind: ");
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
            if (keyword !== "no") {
              continue;
            }
          }
          // Some "boring" words that often appear in keywords, 
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
function viewProductInfo(queryURL) {
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

    for (var i = 0; i < Math.min(data.search_results.length, 1); i++) {
      var result = {
        title: data.search_results[i].title,
        prime_delivery: data.search_results[i].is_prime,
        asin: data.search_results[i].asin,
        image: data.search_results[i].image,
        rating: data.search_results[i].rating,
        price: data.search_results[i].price.raw,
        link: data.search_results[i].link,
      };

      console.log("Found a product: ", result);

      resultsArray.push(result);

      // Fetching reviews based on the asinURL
      fetch(productUrlFromAsin(result.asin))
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

        var reviewsArray = [];
        for (var j = 0; j < Math.min(productData.product.top_reviews.length, 5); j++) {
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
      })
      .catch(function (error) {
        console.error(error);
      });
    }

    // Now resultsArray contains the desired information for each search result, including reviews
    //console.log(resultsArray);
  })
  .catch(function (error) {
    console.error(error);
  });
}