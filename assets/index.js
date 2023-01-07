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
            // City Name
            let cityNameEl = $('<h3>');
            cityNameEl.text(response.city.name + " " + moment().format('L'))
            // weather icon
            let weatherIconEl = $('<img>');
            weatherIconEl.addClass('src');
            let wIcon = response.list[0].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + wIcon + ".png";
            weatherIconEl.attr("src", iconURL)
            console.log("url: " + iconURL);
            //Add temp, wind and humidity
            let currentTemp = $('<h5>').text("Temp: " + response.list[0].main.temp)  // TODO: ADD DEGREES SYMBOL
            let currentWind = $('<h5>').text("Wind: " + response.list[0].wind.speed)
            let currentHumidity = $('<h5>').text("Humidity: " + response.list[0].main.humidity)
            $('#today').append(cityNameEl, weatherIconEl, currentTemp, currentWind, currentHumidity);
            console.log("test1")

            // FORECAST
            let forecastWind = $('<h5>').text("Wind: " + response.list[8].wind.speed)
            let forecastHumidity = $('<h5>').text("Humidity: " + response.list[8].main.humidity)
            
            var forecastCard = $('#forecast').children();
            console.log(forecastCard[0]);
            // // FOR FORECAST CARDS
            for (i=0; i < 5; i++) {
                // let forecastTemp = $('<h5>').text("Temp: " + response.list[8].main.temp)  // TODO: ADD DEGREES SYMBOL
                let forecastTemp = $('<h5>').text(i)  // TODO: ADD DEGREES SYMBOL
                var currentCard = forecastCard[i]
                forecastCard.append(forecastWind, cityNameEl);
                // currentCard.append(forecastTemp, forecastWind, forecastHumidity)
                // forecastArea.append(cityNameEl);
            }
            console.log("city: " + response.city.name)
            console.log("date/time: " + response.list[0].dt_txt)
            console.log("date/time (moment.js): " + moment().format('L'))
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    getLatLong(city);
})

