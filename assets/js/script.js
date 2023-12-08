const apiKey = "D961BC3F959A416CB66BA38ED853CB39";
const baseURL = `https://api.rainforestapi.com/request?api_key=${apiKey}&type=search&amazon_domain=amazon.com`;

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});

function isPrimeDelivery() {
  return document.getElementById("prime-delivery").checked;
}

// returns the selected category's specific amazon category id
// appended to our query by: category_id=getCategories()
// If no catgeory was selected at submit time an empty string will be returned
function getCategory() {
  var e = document.getElementById("product-categories");
  return e.options[e.selectedIndex].value;
}

// Each chip tag will be added to our query in the `search_term` parameter
// For example: 2chips with "memory cards" "64GB" will be appended to
// our fetch request as &search_term=memory%20cards+64gb
//
// Each keyword is added to a global set which is constantly modified as
// the user
var keywords = new Set();
document.addEventListener("DOMContentLoaded", function () {
  
  var elems = document.querySelectorAll(".chips");

  function sanitizeTag(tag) {
    return tag.replace(/\s/g, '%20').trim().toLowerCase();
  }

  var instances = M.Chips.init(elems, {
    onChipAdd: function(elem, addedChip) {
      var addedChipTag = addedChip.textContent.replace('close', '');
      console.log("Added a chip tag:", addedChipTag);
      keywords.add(sanitizeTag(addedChipTag));
    },
    onChipDelete: function(elem, deletedChip) {
      var deletedChipTag = deletedChip.textContent.replace('close', '');
      console.log(`Deleted a chip tag: ${deletedChipTag}`);
      keywords.delete(sanitizeTag(deletedChipTag));
    }
  });
});

function createQuery() {
  let queryURL = baseURL;

  if (keywords.size) {
    queryURL += `&search_term=${Array.from(keywords).join('+')}`
  }

  var categoryId = getCategory();
  if (categoryId) {
    queryURL += `&category_id=${categoryId}`;
  }
  console.log("Query URL constructed: ", queryURL);
  return queryURL;
}

// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();
  console.log("keyword chips are: ", keywords);
  createQuery();
  console.log('prime delivery:>',   isPrimeDelivery());

});
