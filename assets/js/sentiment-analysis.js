// other scriptfiles only have to call one function to iterate over the top 5 reviews for the product
// sentimentAnalysis(reviewsArray), reviewsArray is an array of objects containing review info
// function sentimentAnalysis will have to be inside a for loop to grab each product and its tops reviews

//------------------------------------------------------------------------------//
//-------this block has to be deleted before submitting project-----------------//
//------------------------------------------------------------------------------//

// sentimentAnalysis(testReviews);
/*
var storedResults = JSON.parse(localStorage.getItem("results"));
console.log(storedResults);

for (var i = 0; i < storedResults.length; i++) {
  var product = storedResults[i];
  sentimentAnalysis(product.reviews, product);
}
*/

// testReviews was defined in test-product-review.js file

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

var sentimentArray = [];

function sentimentAnalysis(reviewsArray, currentProduct) {
  //this function will iterate through all the reviews with a time delay of 5 seconds in between the reviews
  //after it iterates through all, the final rating is calculated and passed to the addPropertytoProduct function
  //rapidAPI has a rate limit of 2 requests per 10 seconds, hence the time delay

  console.log("request to sentiment API has started!");
  var i = 0;
  var requestInterval = setInterval(function () {
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
    console.log("request for review number " + i + " i = " + i);

    var fetchData = fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        sentiment = data.type;
        return sentiment;
      });
    sentimentArray = getSentimentArray(fetchData);
    console.log("promise array ", sentimentArray);

    i++;

    //when i is equal to the length it will stop the iteration and calculate total
    //sentiment and call to add property

    if (i === reviewsArray.length) {
      clearInterval(requestInterval);
      console.log("interval has stopped at i = ", i);
      Promise.all(sentimentArray).then(function (array) {
        console.log(array);
        var totalRating = calculateSentiment(array);
        console.log("calculated sentiment rating:", totalRating);
        addPropertytoProduct(totalRating, currentProduct);
      });
    }
  }, 5000);
}

function getSentimentArray(sentiment) {
  //this function will save the current sentiment response in an array and call to calculate sentiment score
  sentimentArray.push(sentiment);

  return sentimentArray;
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
  return totalRating;
}

function addPropertytoProduct(sentimentRating, currentProduct) {
  //the product is stored in a global variable from the Rainforest API product data API
  //grab this object.sentiment_score = sentimentRating;

  currentProduct.sentiment_score = sentimentRating;
  console.log("product with new property of sentiment_score ", currentProduct);
  localStorage.setItem(
    "with sentiment score " + currentProduct.asin,
    JSON.stringify(currentProduct)
  );
  return currentProduct;
}
