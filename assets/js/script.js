document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".chips");
  var chipInput = document.querySelectorAll(".search-words");
  console.log(chipInput);
  var instances = M.Chips.init(elems, {
    onChipAdd: function (elem, somethingElse) {
        console.log(elem);
        console.log(somethingElse);
        var instance = M.Chips.getInstance(0);
        console.log(instances[0].chipsData);
    },
  });
  console.log(instances[0].chipsData);
});
