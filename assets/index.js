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
    let queryURL = baseURL + geocode + "&appid=" + APIKey + "&units=metric";
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
      })
    .then(function(response) {
            console.log(response)
            let cityNameEl = $('<h3>');
            cityNameEl.text(response.city.name + " " + moment().format('L'))
            // weather icon
            let weatherIconEl = $('<img>');
            weatherIconEl.addClass('src');
            let wIcon = response.list[0].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + wIcon + ".png";
            weatherIconEl.attr("src", iconURL)
            console.log("url: " + iconURL);
            $('#today').append(cityNameEl, weatherIconEl);

            console.log("city: " + response.city.name)
            console.log("weather desc: " + response.list[0].weather.icon)
            console.log("clouds: " + response.list[0].clouds.all)
            console.log("current temp: " + response.list[0].main.temp)
            console.log("date/time: " + response.list[0].dt_txt)
            console.log("wind: " + response.list[0].wind.speed)
            console.log("Humidity: " + response.list[0].humidity)
            console.log("date/time (moment.js): " + moment().format('L'))
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function () {
    event.preventDefault();
    var city = $('#search-input').val();
    getLatLong(city);
})

