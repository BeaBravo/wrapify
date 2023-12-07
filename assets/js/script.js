document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});


// Each chip tag will be added to our query in the `search_term` parameter
// For example: 2chips with "memory cards" "64GB" will be appended to
// our fetch request as &search_term=memory%20cards+64gb
//
// Each keyword is added to a global set which is constantly modified as
// the user
var keywords = new Set();
document.addEventListener("DOMContentLoaded", function () {
  
  var elems = document.querySelectorAll(".chips");
  var chipInput = document.querySelectorAll(".search-words");

  var instances = M.Chips.init(elems, {
    onChipAdd: function (elem, somethingElse) {
        var instance = M.Chips.getInstance(0);
        var tags = instances[0].chipsData.map(function(chip){
          // Replace white space with escaped '%20'
          var updatedTag = chip.tag.replace(/\s/g, '%20');
          keywords.add(updatedTag);
        }).join('+');
    },
  });
});

const categoryIDs = {
  amazonfresh: "amazonfresh",
  amazoninstantvideo: 2858778011,
  appliances: 2619526011,
  appsandgames: 2350150011,
  artscraftssewing: 2617942011,
  audible: "audible",
  automotive: 15690151,
  baby: 165797011,
  beauty: 11055981,
  books: 1000,
  cdsandvinyl: 301668,
  cellphonesandaccessories: 2335753011,
  clothingshoesandjewelery: 7141124011,
  collectiblesandfinearts: 4991426011,
  digitalmusic: 624868011,
  electronics: 493964,
  giftcards: 2864120011,
  grocerandgourmetfood: 16310211,
  handmade: 11260433011,
  healthandpersonalcare: 3760931,
  homeandkitchen: 1063498,
  industrialandscientific: 16310161,
  kindlestore: 133141011,
  magazinesubscriptions: 599872,
  moviesandtv: 2625374011,
  musicalinstruments: 11965861,
  officeproducts: 1084128,
  patiolawnandgarden: 3238155011,
  petsupplies: 2619534011,
  software: 409488,
  sportsandoutdoors: 3375301,
  toolsandhomeimprovement: 468240,
  toysandgames: 165795011,
  vehicles: 10677470011,
  videogames: 11846801,
}

// returns the selected category's specific amazon category id
// appended to our query by: category_id=getCategories()
// If no catgeory was selected at submit time an empty string will be returned
function getCategories() {
  var e = document.getElementById("product-categories");
  return e.options[e.selectedIndex].value;
}




// The submit button
document.getElementById('search-button').addEventListener('click', function(event) {
  event.preventDefault();
  console.log("keyword chips are: ", keywords);


  getCategories();
});
