// OpenWeather API
var baseURL = "https://api.openweathermap.org/data/2.5/forecast"
// OpenWeatherGeocoder API
var baseGeoURL = "http://api.openweathermap.org/geo/1.0/direct"
var APIKey = "64bc025f8b557eda09cfd4307609235d";

// Convert city to lat&lon using Geocoder 
function getLatLong(city) {
    console.log("getLatLong function was passed this arg: " + city) // ! Debugging
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
    let queryURL = baseURL + geocode + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
      })
    .then(function(response) {
            console.log(response)
            // console.log("current temp: " + list.main.temp)
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function () {
    event.preventDefault();
    var city = $('#search-input').val();
    getLatLong(city);
})

