// other scriptfiles only have to call one function to iterate over the top 5 reviews for the product
// sentimentAnalysis(reviewsArray), reviewsArray is an array of objects containing review info
// function sentimentAnalysis will have to be inside a for loop to grab each product and its tops reviews

//------------------------------------------------------------------------------//
//-------this block has to be deleted before submitting project-----------------//
//------------------------------------------------------------------------------//

// sentimentAnalysis(testReviews);

var testSentimentArray = [
  "positive",
  "negative",
  "positive",
  "positive",
  "neutral",
];

//testData was defined in test-search.js
var results = testData.search_results;
var usersProduct = results[22]; //picked a random product from array
var topFiveResults = [
  results[0],
  results[1],
  results[2],
  results[3],
  results[4],
];

calculateSentiment(testSentimentArray);
// console.log(sentiment);

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

var sentimentArray = [];

function sentimentAnalysis(reviewsArray) {
  for (var i = 0; i < reviewsArray.length; i++) {
    const url = "https://twinword-sentiment-analysis.p.rapidapi.com/analyze/";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "5901c52a65msh8bbb26b5dff2e05p11e8f9jsn5ad0d7fa75e8",
        "X-RapidAPI-Host": "twinword-sentiment-analysis.p.rapidapi.com",
        "Retry-After": 3, //in case it fails we want to wait three seconds to try again
      },
      body: new URLSearchParams({
        text: reviewsArray[i].body,
      }),
    };

    // fetchSentimentData(url, options);
    var sentiment = fetchSentimentData(url, options);
    console.log("from fetchSentimentData function: ", sentiment);
  }
  return sentiment;
}

function fetchSentimentData(url, options) {
  //this function is to create an API request to twinword with the content of the review
  fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      sentiment = data.type;
      getSentimentArray(sentiment);
    });
}

function getSentimentArray(sentiment) {
  //this function will save the current sentiment response in an array and call to calculate sentiment score
  sentimentArray.push(sentiment);
  console.log(sentimentArray);
  var score = calculateSentiment(sentimentArray);
  return score;
}

function calculateSentiment(array) {
  //this will count how many positive reviews this product has and calculate a score out of 1
  var totalSentiment = 0;
  var sentimentScore = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === "positive") {
      sentimentScore = 1;
    } else {
      sentimentScore = 0;
    }

    totalSentiment = totalSentiment + sentimentScore;
  }
  totalRating = totalSentiment / array.length;
  addPropertytoProduct(totalRating);
  return totalRating;
}

function addPropertytoProduct(sentimentRating) {
  //the product is stored in a global variable from the Rainforest API product data API
  //grab this object.sentiment_score = sentimentRating;
  var currentResult = topFiveResults[0]; //<------ this needs to be updated with array ----------->
  // console.log(currentResult);
  currentResult.sentiment_score = sentimentRating;
  console.log(currentResult);
  return currentResult;
}

//somewhere in here this needs to go back to add a property into the resultsArray element these reviews belong to
