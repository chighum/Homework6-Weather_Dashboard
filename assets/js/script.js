// link to secret API key
var APIKey = config.APIKey;
var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
var cityForm = $("#city-form");
var cityList = $("#city-list");
var clearCities = $("#clear-cities-btn");
var today = moment();

// when the user submits a city it shows the current weather and five day forecast
// and also saves the city local storage
function saveCity(event) {
  event.preventDefault();
  var cityInput = $("#city-input").val();
  storedCities.push(cityInput);
  localStorage.setItem("cities", JSON.stringify(storedCities));
  getWeather(cityInput);
  $("#city-input").val("");
  renderCities();
}

cityForm.on("submit", saveCity);

// functionality to show each local storage entry to the screen
function renderCities() {
  cityList.text("");
  for (var i = 0; i < storedCities.length; i++) {
    var cityListEntry = $("<li>");
    var cityListItem = $("<button class='uppercase redo-city-btn'>");
    cityListItem.text(storedCities[i]);
    cityListEntry.attr("data-index", i);
    var deleteItemButton = $("<button class='delete-item-btn'>x</button>");
    cityListEntry.append(cityListItem);
    cityListEntry.append(deleteItemButton);
    cityList.append(cityListEntry);
  }
}

clearCities.on("click", function (event) {
  event.preventDefault();
  localStorage.clear();
  storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  renderCities();
});

// delete individual items from the list of cities
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

// allow user to click on a saved city and see the forecast again
function redoCity(event) {
  event.preventDefault();
  var btnClicked = event.target;
  if (btnClicked.matches(".redo-city-btn")) {
    var newCity = btnClicked.innerHTML;
    getWeather(newCity);
  }
}

cityList.on("click", redoCity);

renderCities();

// makes two API calls to openweather
// 1st for the five day forecast because it can take a city input
// 2nd for the current weather because it needs lat/long coordinates from the 1st call
function getWeather(cityName) {
  var fiveDayURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;
  fetch(fiveDayURL)
    .then(function (fiveDayResponse) {
      return fiveDayResponse.json();
    })
    .then(function (fiveDayForecast) {
      console.log(fiveDayForecast);
      var midDayForecasts = fiveDayForecast.list.filter(function (inputs) {
        return inputs.dt_txt.includes("12:00");
      });
      // console.log(midDayForecasts);
      $("#five-day").empty();
      for (x = 0; x < midDayForecasts.length; x++) {
        var day = $("<div class='col-2'>");
        var date = $("<h5>");
        var iconRow = $("<div>");
        var iconImg = $("<img>");
        var iconInfo = $("<p class='uppercase'>");
        var temp = $("<p>");
        var humidity = $("<p>");
        var wind = $("<p>");

        date.text(midDayForecasts[x].dt_txt.split(" ")[0]);
        iconImg.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            midDayForecasts[x].weather[0].icon +
            "@2x.png"
        );
        iconInfo.text(midDayForecasts[x].weather[0].description);
        temp.text("Temperature: " + midDayForecasts[x].main.temp + "°F");
        humidity.text("Humidity: " + midDayForecasts[x].main.humidity + "%");
        wind.text("Wind Speed: " + midDayForecasts[x].wind.speed + " knots");

        iconRow.append(iconImg, iconInfo);

        day.append(date, iconRow, temp, humidity, wind);
        $("#five-day").append(day);
      }

      var cityLat = fiveDayForecast.city.coord.lat;
      var cityLong = fiveDayForecast.city.coord.lon;
      var todayURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityLat +
        "&lon=" +
        cityLong +
        "&units=imperial&appid=" +
        APIKey;
      return fetch(todayURL);
    })
    .then(function (todayResponse) {
      return todayResponse.json();
    })
    .then(function (todayWeather) {
      // console.log(todayWeather);
      var city = $("<h3 class='uppercase'>");
      var todayDate = $("<h3>");
      var todayIconRow = $("<div>");
      var todayIconImg = $("<img>");
      var todayIconInfo = $("<p class='uppercase'>");
      var todayTemp = $("<p>");
      var todayHumidity = $("<p>");
      var todayWind = $("<p>");
      var todayUV = $("<p>");

      city.text(cityName);
      todayDate.text(today.format("MMMM Do, YYYY"));
      todayIconImg.attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          todayWeather.current.weather[0].icon +
          "@2x.png"
      );
      todayIconInfo.text(todayWeather.current.weather[0].description);
      todayTemp.text("Temperature: " + todayWeather.current.temp + "°F");
      todayHumidity.text("Humidity: " + todayWeather.current.humidity + "%");
      todayWind.text(
        "Wind Speed: " + todayWeather.current.wind_speed + " knots"
      );

      todayUV.text("UV Index: ");
      var UVIndex = todayWeather.current.uvi;
      var bgColor = $("<span>");
      bgColor.html(UVIndex);
      // if/else statement to apply background color to the UV Index depending on the #
      if (UVIndex < 3) {
        bgColor.css("background-color", "green");
      } else if (UVIndex < 6) {
        bgColor.css("background-color", "yellow");
      } else if (UVIndex < 8) {
        bgColor.css("background-color", "orange");
      } else if (UVIndex < 11) {
        bgColor.css("background-color", "red");
      } else {
        bgColor.css("background-color", "purple");
      }

      todayUV.append(bgColor);

      $("#today").empty();

      todayIconRow.append(todayIconImg, todayIconInfo);

      $("#today").append(
        city,
        todayDate,
        todayIconRow,
        todayTemp,
        todayHumidity,
        todayWind,
        todayUV
      );
    });
}
