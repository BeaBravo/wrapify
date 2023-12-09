var resultEl = $(".custom-section");

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
  resultEl.html("");

  for (var i = 0; i < topFiveResults.length; i++) {
    var result = topFiveResults[i];
    var title = result.title;
    var price = result.price.raw; //will show the price as a string
    var primeDelivery = result.is_prime; //this is a boolean property
    var image = result.image;
    var rating = result.rating; //this is a number
    var link = result.link;
    var stars = starsRating("star ", rating);

    //description=result.description
    //sentiment=result.sentiment
    var description =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, blanditiis magnam ab aliquam quia ipsa laborum quis eius, deleniti animi ipsum, eligendi iure porro minus quos mollitia doloribus in quas.";
    var sentiment = "positive";
    var sentimentDiv = sentimentRender(sentiment);
    //display

    resultEl.append(
      '<div class="card row custom-card hoverable"><h5>' +
        title +
        '</h5><div class="col s12 m4 l4 responsive-image"><img src=' +
        image +
        " /></div>" +
        '<div class="custom-card-content col s12 m8 l8">' +
        '<div class="row">' +
        '<div class"col s12">' +
        description +
        "</div></div>" +
        '<div class="row custom info"><div class="col s6 m2 l2">Price: ' +
        price +
        '</div><div class="col s6 m5 l5">Rating: <span class="material-icons">' +
        stars +
        "</span>" +
        "</div>" +
        sentimentDiv +
        "</div>" +
        '<div class="col s12"><a class="btn-small waves-effect waves-light right" id="buy-now-button" href=' +
        link +
        ' target="_blank">Buy now </a></div>' +
        "</div>" //div to close custom-card
    );
  }
}

displayResults();

function starsRating(string, times) {
  if (times - Math.floor(times) >= 0.5) {
    string += string.repeat(times - 1) + "star_half";
    return string;
  } else {
    string += string.repeat(times - 1);
    return string;
  }
}

function sentimentRender(sentiment) {
  if (sentiment === "positive") {
    sentimentDiv =
      '<div class="col s12 m4 l4 sentiment-value"><span class="material-icons">sentiment_very_satisfied</span><p>This product is greatly reviewed</p></div>';
    return sentimentDiv;
  } else {
    sentimentDiv =
      '<div class="col s12 m4 l4 sentiment-value"><span class="material-icons">sentiment_very_dissatisfied</span><p>This product is badly reviewed</p></div>';
    return sentimentDiv;
  }
}
