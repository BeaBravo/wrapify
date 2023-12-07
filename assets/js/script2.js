
var productDescription = data.product.description;
var productImageLink = data.product.main_image.link;
var userReviews = data.product.top_reviews;
var reviewsData = [];


  
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
       
        for (var i = 0; i < data.product.top_reviews.length; i++) {
            var review = {
                body: data.top_reviews[i].body,
                rating: data.top_reviews[i].rating,
                isGlobal: data.top_reviews[i].is_global_review
            };
            
            reviewsData.push(review);
        }
        })
    
    for (var i = 0; i < reviewsData.length; i++) {
    fconst url = 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
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