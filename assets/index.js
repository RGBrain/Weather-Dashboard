var APIKey = "64bc025f8b557eda09cfd4307609235d";
var baseURL = "https://api.openweathermap.org/data/2.5/forecast"
var baseGeoURL = "http://api.openweathermap.org/geo/1.0/direct"
// ! FORMAT:
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.
// ! Geo FORMAT
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// ? Use for Lat/long data 
// use https://openweathermap.org/api/geocoding-api 

// Query Geocoding API for lat/long data 
function getLatLong(city) {
    let queryURL = baseGeoURL + "?q=" + city + "&limit=1&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
      })
    .then(function(response) {
            var geocode = "?lat=" + response[0].lat.toFixed(2) + "&lon=" + response[0].lon.toFixed(2);
            getWeatherInfo(geocode);
        })
}

// Get weather info
function getWeatherInfo(geocode) {
    console.log (geocode);
    let queryURL = baseURL + geocode + "&appid=" + APIKey;
    console.log (queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
      })
    .then(function(response) {
            console.log(response)
        })
}


var city = $('#search-input').val();
console.log ("the city is" + city);
$('#search-button').on('click', getLatLong("Paris"));

