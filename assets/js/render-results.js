// other scriptfiles only have to call these two functions
// displayUsersChoice(product), product is an object and the function will display the user's input product
// displayResults(results), results is an array of objects and the function will display the top results from the query



var resultEl = $("#results-page");
var usersChoiceEl = $("#users-choice");

function displayResults(results) {
  //we want to display: title, description, price, prime delivery, image, rating, and sentiment analysis, link to buy now//
  //build a for loop to make new objects for this data
  resultEl.html("");
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    var title = result.title;
    var price = result.price; //will show the price as a string
    var primeDelivery = isPrime(result.is_prime); //this is a boolean property
    var image = result.image;
    var rating = result.rating; //this is a number
    var link = result.link;
    var stars = starsRating("star ", rating);
    var sales = result.recent_sales;

    // SET TO 1 FOR NOW
    var sentiment=1 //result.sentiment_score
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
  var sentimentString = "";
  var sentimentDiv;
  
  /*
  if (sales !== undefined) {
    sentimentString = sales;
  } else {
    sentimentString = "";
  }
  */

  if (sentiment > 0.4) {
    sentimentString = " " + Number(sentiment*100).toString() + "% positive reviews";
    sentimentDiv = `<div class="col s6 offset-s3 m4 l4 sentiment-value positive-sentiment"><span class="material-icons">sentiment_very_satisfied</span><p>${sentimentString}</p></div>`
 
  } else {
    sentimentDiv = `<div class="col s6 offset-s3 m4 l4 sentiment-value negative-sentiment"><span class="material-icons">sentiment_very_dissatisfied</span><p>${sentimentString}</p></div>`;
  }

  return sentimentDiv;
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

function displayUsersChoice(usersProduct) {
  usersChoiceEl.html("");
  var title = usersProduct.title;
  var price = usersProduct.price.raw; //will show the price as a string
  var primeDelivery = isPrime(usersProduct.is_prime); //this is a boolean property
  var image = usersProduct.image;
  var rating = usersProduct.rating; //this is a number
  var link = usersProduct.link;
  var stars = starsRating("star ", rating);
  var sales = usersProduct.recent_sales;

  //description=result.description
  //sentiment=result.sentiment
  var description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, blanditiis magnam ab aliquam quia ipsa laborum quis eius, deleniti animi ipsum, eligendi iure porro minus quos mollitia doloribus in quas.";
  var sentiment = "positive";
  var sentimentDiv = sentimentRender(sentiment, sales);
  //display

  usersChoiceEl.append(
    '<div class="card row custom-card hoverable"><div class="col s4 m3 l3 xl2 rotate">Your pick</div><h5>' +
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

document.addEventListener("DOMContentLoaded", function() {
  var data = JSON.parse(localStorage.getItem("results"));
  console.log("Data in render-results.js file -> ", data);
  displayResults(data);
  //displayUsersChoice(usersProduct);
});

/*
var data = JSON.parse(localStorage.getItem("results"));
console.log("Data in render-results.js file -> ", data);
displayResults(data);
//displayUsersChoice(usersProduct);
*/
