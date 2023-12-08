
var productDescription = data.product.description;
var productImageLink = data.product.main_image.link;
var userReviews = data.product.top_reviews;
var reviewsData = [];


//AMAZON API  
fetch(queryURL)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  for (var i = 0; i < data.product.top_reviews.length; i++) {
    var review = {
      body: data.product.top_reviews[i].body,
      rating: data.product.top_reviews[i].rating,
      isGlobal: data.product.top_reviews[i].is_global_review
    };
    reviewsData.push(review);
  }
});

    
    //SENTIMENT API
    for (var i = 0; i < reviewsData.length; i++) {
        const url = 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/';
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'YOUR-RAPIDAPI-KEY', // Replace with your actual RapidAPI key
            'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
          },
          body: new URLSearchParams({
            text: reviewsData[i].body
          })
        };
    
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
          } catch (error) {
            console.error(error);
          }
        }