var APIKey = config.APIKey;

var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
var cityForm = $("#city-form");
var cityList = $("#city-list");

function saveCity(event) {
  event.preventDefault();
  var cityInput = $("#city-input").val();
  storedCities.push(cityInput);
  localStorage.setItem("cities", JSON.stringify(storedCities));
  getForecast(cityInput);
  $("#city-input").val("");
  renderCities();
}

function getForecast(cityName) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

cityForm.on("submit", saveCity);

function renderCities() {
  cityList.text("");
  for (var i = 0; i < storedCities.length; i++) {
    var cityListEntry = $("<li>");
    var cityListItem = $("<button>");
    cityListItem.text(storedCities[i]);
    cityListItem.attr("data-index", i);
    var deleteItemButton = $("<button class='delete-item-btn'>x</button>");
    cityListEntry.append(cityListItem);
    cityListEntry.append(deleteItemButton);
    cityList.append(cityListEntry);
  }
}

function deleteItem(event) {
  event.preventDefault();
  var btnClicked = event.target;
  if (btnClicked.matches(".delete-item-btn")) {
    var parentItem = btnClicked.parentElement;
    var index = parentItem.getAttribute("data-index");
    storedCities.splice(index, 1);
    localStorage.setItem("cities", JSON.stringify(storedCities));
    renderCities();
  }
}

cityList.on("click", deleteItem);

renderCities();
