//testData was defined in test-search.js

var results = testData.search_results;

//we want to render the top 5 results

var topFiveResults = [
  results[0],
  results[1],
  results[2],
  results[3],
  results[4],
];

// console.log(topFiveResults);

function displayResults() {
  //we want to display: title, description, price, prime delivery, image, rating, and sentiment analysis, link to buy now//
  //build a for loop to make new objects for this data
  var i = 0;
  var result = topFiveResults[i];
  var title = result.title;
  var price = result.price.raw; //will show the price as a string
  var primeDelivery = result.is_prime; //this is a boolean property
  var image = result.image;
  var rating = result.rating; //this is a number
  var link = result.link;
  //description=result.description
  //sentiment=result.sentiment

  //display using innerHTML('')
}
