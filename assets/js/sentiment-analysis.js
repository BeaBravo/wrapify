// other scriptfiles only have to call one function to iterate over the top 5 reviews for the product
// sentimentAnalysis(reviewsArray), reviewsArray is an array of objects containing review info

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

calculateSentiment(testSentimentArray);

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
        "Retry-After": 60, //in case it fails we want to wait three seconds to try again
      },
      body: new URLSearchParams({
        text: reviewsArray[i].body,
      }),
    };

    fetchSentimentData(url, options);
  }
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
  calculateSentiment(sentimentArray);
}

function calculateSentiment(array) {
  //this will calculate a total sentiment. +1 for every positive review, -1 for every negative, 0 for every neutral review
  var totalSentiment = 0;
  var sentimentScore = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === "positive") {
      sentimentScore = 1;
    } else if (array[i] === "negative") {
      sentimentScore = -1;
    } else {
      sentimentScore = 0;
    }

    totalSentiment = totalSentiment + sentimentScore;
  }
  console.log("total sentiment: ", totalSentiment);
  return totalSentiment;
}
