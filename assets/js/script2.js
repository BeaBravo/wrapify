
var productDescription = data.product.description;
var productImageLink = data.product.main_image.link;
var userReviews = data.product.top_reviews;
var reviewsData = [];


  
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
       

        for (var i = 0; i < data.top_reviews.length; i++) {
            var review = {
                body: top_reviews[i].body,
                rating: top_reviews[i].rating,
                isGlobal: top_reviews[i].is_global_review
            };
            
            reviewsData.push(review);
        }
        })
     
    fetch(sentimentURL)