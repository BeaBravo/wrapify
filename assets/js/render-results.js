var resultEl = $("#results-page");
var usersChoiceEl = $("#users-choice");

//testData was defined in test-search.js
var results = testData.search_results;

//we want to render the top 5 results

var usersProduct = results[22]; //picked a random product from array

var topFiveResults = [
  results[0],
  results[1],
  results[2],
  results[3],
  results[4],
];

function displayResults(topFiveResults) {
  //we want to display: title, description, price, prime delivery, image, rating, and sentiment analysis, link to buy now//
  //build a for loop to make new objects for this data
  resultEl.html("");

  for (var i = 0; i < topFiveResults.length; i++) {
    var result = topFiveResults[i];
    var title = result.title;
    var price = result.price.raw; //will show the price as a string
    var primeDelivery = isPrime(result.is_prime); //this is a boolean property
    var image = result.image;
    var rating = result.rating; //this is a number
    var link = result.link;
    var stars = starsRating("star ", rating);
    var sales = result.recent_sales;

    //description=result.description
    //sentiment=result.sentiment
    var description =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, blanditiis magnam ab aliquam quia ipsa laborum quis eius, deleniti animi ipsum, eligendi iure porro minus quos mollitia doloribus in quas.";
    var sentiment = "positive";
    var sentimentDiv = sentimentRender(sentiment, sales);
    //display

    resultEl.append(
      '<div class="card row custom-card hoverable"><h5>' +
        title +
        '</h5><div class="col s12 m4 l4 responsive-image"><img src=' +
        image +
        " /></div>" +
        '<div class="custom-card-content col s12 m8 l8">' +
        '<div class="row">' +
        '<div class="col s12 hide-on-small-only">' +
        description +
        "</div></div>" +
        '<div class="row custom info"><div class="col s6 m3 l3">Price: ' +
        price +
        primeDelivery +
        '</div><div class="col s6 m5 l5"> <span class="material-icons">' +
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

function starsRating(string, times) {
  if (times - Math.floor(times) >= 0.5) {
    string += string.repeat(times - 1) + "star_half";
    return string;
  } else {
    string += string.repeat(times - 1);
    return string;
  }
}

function sentimentRender(sentiment, sales) {
  //this function will add a div for sentiment depending if its positive or negative including styling classes
  if (sentiment === "positive" && sales !== undefined) {
    sentimentDiv =
      '<div class="col s6 offset-s3 m4 l4 sentiment-value positive-sentiment"><span class="material-icons">sentiment_very_satisfied</span><p class="hide-on-med-and-down">' +
      sales +
      "</p></div>";
    return sentimentDiv;
  } else if (sentiment === "positive" && sales === undefined) {
    sentimentDiv =
      '<div class="col s6 offset-s3 m4 l4 sentiment-value positive-sentiment"><span class="material-icons">sentiment_very_satisfied</span><p></p></div>';
    return sentimentDiv;
  } else {
    sentimentDiv =
      '<div class="col s6 offset-s3 m4 l4 sentiment-value negative-sentiment"><span class="material-icons">sentiment_very_dissatisfied</span><p>We do not recommend this product</p></div>';
    return sentimentDiv;
  }
}

function isPrime(prime) {
  if (prime) {
    primeDelivery = '<div class="row"><img class="prime-logo"/></div>';
    return primeDelivery;
  } else {
    primeDelivery = "";
    return primeDelivery;
  }
}

console.log(topFiveResults);
displayResults(topFiveResults);
console.log(results);

//function to display user's product choice at the top
function displayUsersChoice() {
  usersChoiceEl.html("");
}
