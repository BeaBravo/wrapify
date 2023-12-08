var queryURL =
  "https://api.rainforestapi.com/request?api_key=D961BC3F959A416CB66BA38ED853CB39&type=search&amazon_domain=amazon.com&search_term=shoes+boots+sneakers&category_id=7141124011";

//AMAZON API ------------ Neil's script--------//
// fetch(queryURL)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     for (var i = 0; i < data.top_reviews.length; i++) {
//       var review = {
//         body: data.top_reviews[i].body,
//         rating: data.top_reviews[i].rating,
//         isGlobal: data.top_reviews[i].is_global_review,
//       };
//     }

//     var productInfo = {
//       productDescription: data.product.description,
//       productImage: data.product.main_image.link,
//     };
//     reviewsData.push(review);
//   });
//AMAZON API ------------ Neil's script--------//
//--------------------------------------------//

fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
