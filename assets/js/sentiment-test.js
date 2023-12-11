// other scriptfiles only have to call one function to iterate over the top 5 reviews for the product
// sentimentAnalysis(reviewsArray), reviewsArray is an array of objects containing review info

//------------------------------------------------------------------------------//
//-------this block has to be deleted before submitting project-----------------//
//------------------------------------------------------------------------------//

sentimentAnalysis(testReviews);

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

var sentimentArray = [];

function sentimentAnalysis(reviewsArray) {
  for (var i = 0; i < 5; i++) {
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

    postData(url, options);
  }
}

function postData(url, options) {
  //this function is to create an API request to twinword with the content of the review
  fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   sentimentObject.sentimentResults = data;
      sentiment = data.type;
      getSentimentArray(sentiment);
    });
}

function getSentimentArray(sentiment) {
  //this function will save the current sentiment response in an array
  sentimentArray.push(sentiment);
  console.log(sentimentArray);
  return sentimentArray;
}
