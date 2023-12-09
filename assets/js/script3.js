// SEARCH LISTINGS API
// USER JOURNEY 1
fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var resultsArray = [];

    for (var i = 0; i < Math.min(data.search_results.length, 5); i++) {
      var result = {
        title: data.search_results[i].title,
        prime_delivery: data.search_results[i].is_prime,
        asin: data.search_results[i].asin,
        image: data.search_results[i].image,
        rating: data.search_results[i].rating,
        price: data.search_results[i].price.raw,
        link: data.search_results[i].link,
      };

      resultsArray.push(result);

      // Assuming asinURL is a function that takes an ASIN and returns a URL
      var asinURL = getAsinURL(result.asin);

      // Fetching reviews based on the asinURL
      fetch(asinURL)
        .then(function (response2) {
          return response2.json();
        })
        .then(function (data2) {
          var reviewsArray = [];

          for (var j = 0; j < Math.min(data2.top_reviews.length, 5); j++) {
            var review = {
              body: data2.top_reviews[j].body,
              rating: data2.top_reviews[j].rating,
              isGlobal: data2.top_reviews[j].is_global_review,
            };
            reviewsArray.push(review);
          }

          // Associating reviewsArray with the corresponding result
          result.reviews = reviewsArray;
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    // Now resultsArray contains the desired information for each search result, including reviews
    console.log(resultsArray);
  })
  .catch(function (error) {
    console.error(error);
  });

// Placeholder for the logic to generate the URL based on the ASIN
function getAsinURL(asin) {
  // Implement the logic to generate the URL based on the ASIN
  // For example, return a URL like 'https://example.com/reviews?asin=' + asin;
}