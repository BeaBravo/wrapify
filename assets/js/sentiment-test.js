// testReviews is an array of object. We want to itirate and use testReviews[i].body as text

sentimentArray = [];

for (var i = 0; i < 5; i++) {
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
      text: testReviews[i].body,
    }),
  };
  // console.log(testReviews[i].body);
  // console.log(testReviews[i].body.length);
  postData(url, options);
  // console.log(sentiment);
  //   sentimentArray.push(sentiment);
}

// console.log(sentimentArray);
var sentimentObject = {};
function postData(url, options) {
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
  sentimentArray.push(sentiment);
  console.log(sentimentArray);
}
