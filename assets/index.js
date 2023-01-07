// OpenWeather API
var baseURL = "https://api.openweathermap.org/data/2.5/forecast"
// OpenWeatherGeocoder API
var baseGeoURL = "http://api.openweathermap.org/geo/1.0/direct"
var APIKey = "64bc025f8b557eda09cfd4307609235d";

// Date formatting
function getDateFormat(date) {
    var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var date = new Date();
    date.toLocaleDateString();
    
    return [day, month, year].join('/');
    }
    ;

// Convert city to lat&lon using Geocoder 
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
            // Date
            var currentDate = getDateFormat(response.list[0].dt_txt);
            cityNameEl.text(response.city.name + " (" + currentDate + ")")
            console.log(cityNameEl);
            // weather icon
            let weatherIconEl = $('<img>');
            weatherIconEl.addClass('src');
            let wIcon = response.list[0].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + wIcon + ".png";
            weatherIconEl.attr("src", iconURL)
            console.log("url: " + iconURL);
            //Add temp, wind and humidity
            let currentTemp = $('<h5>').text("Temp: " + response.list[0].main.temp + " ℃")
            let currentWind = $('<h5>').text("Wind: " + response.list[0].wind.speed + " m/s")
            let currentHumidity = $('<h5>').text("Humidity: " + response.list[0].main.humidity + " %")
            $('#today').empty();
            $('#today').append(cityNameEl, weatherIconEl, currentTemp, currentWind, currentHumidity);
            console.log("test1")
            
            // FORECAST
            // weather icon
            let futureWeatherIconEl = $('<img>');
            futureWeatherIconEl.addClass('src');
            let futurewIcon = response.list[8].weather[0].icon;
            let futureiconURL = "http://openweathermap.org/img/w/" + futurewIcon + ".png";
            futureWeatherIconEl.attr("src", futureiconURL)
            //Add temp, wind and humidity
            let futureDate = getDateFormat(response.list[8].dt_txt);
            let forecastTemp = $('<h5>').text("Temp: " + response.list[8].main.temp + " ℃")
            let forecastWind = $('<h5>').text("Wind: " + response.list[8].wind.speed + " m/s")
            let forecastHumidity = $('<h5>').text("Humidity: " + response.list[8].main.humidity + " %")
            // Add elements to the card
            $('.forecast').append(futureDate, futureWeatherIconEl, forecastTemp, forecastWind, forecastHumidity);
            var dateNow = response.list[0].dt_txt
            var dateNowFormatted = getDateFormat(dateNow);
            console.log("date/time: " + dateNowFormatted)
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    getLatLong(city);
})

