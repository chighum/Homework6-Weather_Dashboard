var APIKey = "13efd7ac45710748643887fcd8e4ec8b";
var cityName;
var queryURL =
  "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

fetch(queryURL);
console.log(APIKey);
