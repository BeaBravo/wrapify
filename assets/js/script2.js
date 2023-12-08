
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
  for (var i = 0; i < data.top_reviews.length; i++) {
    var review = {
      body: data.top_reviews[i].body,
      rating: data.top_reviews[i].rating,
      isGlobal: data.top_reviews[i].is_global_review
    };
    }
    
    var productInfo = {
        productDescription: data.product.description,
        productImage: data.product.main_image.link
      };
    reviewsData.push(review);

});

    
    //SENTIMENT API
    for (var i = 0; i < reviewsData.length; i++) {
        const url = 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/';
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '1KwrcA8BB0EQ/eJfwXBRYANbatZXsCxMnN+8Zvg2fcb9AHYnA8JiYqdb1uYq1R7uujUJ7q6a/Mj/mhvMnFg6BQ==', // Replace with your actual RapidAPI key
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