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
            // CURRENT
            console.log('response line 48',response)

            // let dayIndex = [0,8,16,24,32,39];
            // for (let i = 0; i < dayIndex.length; i++) {
            //     const element = dayIndex[i];

                
            // }
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

            // FORECAST
            let cardArray = $('.forecast').children();
            for (i=0; i < 5; i++) {

                // weather icon
                let futureWeatherIconEl = $('<img>');
                futureWeatherIconEl.addClass('src');
                let futurewIcon = response.list[((i+1) * 8)-1].weather[0].icon;
                let futureiconURL = "http://openweathermap.org/img/w/" + futurewIcon + ".png";
                futureWeatherIconEl.attr("src", futureiconURL)
                //Add date, temp, wind and humidity
                let futureDate = $('<h5>').text(getDateFormat(response.list[((i+1) * 8)-1].dt_txt));
                futureDate.addClass("futureDate text-left")
                let forecastTemp = $('<p>').text("Temp: " + response.list[((i+1) * 8)-1].main.temp + " ℃")
                let forecastWind = $('<p>').text("Wind: " + response.list[((i+1) * 8)-1].wind.speed + " m/s")
                let forecastHumidity = $('<p>').text("Humidity: " + response.list[((i+1) * 8)-1].main.humidity + " %")
                // Add elements to the card
                currentID = '#forecast' + i;
                $(currentID).append(futureDate, futureWeatherIconEl, forecastTemp, forecastWind, forecastHumidity);
            }
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    getLatLong(city);
})

