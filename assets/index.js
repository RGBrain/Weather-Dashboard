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
    };

// Using local storage for search history
let historyArray = [];

function searchHistory(city) {
    historyArray.push(city);
    localStorage.setItem("searches", JSON.stringify(historyArray));
    drawHistoryBtns();
}

// Function to draw buttons
function drawHistoryBtns() {
    // Clear existing buttons
    $('#history').empty();
    const searches = localStorage.getItem("searches");
    console.log(searches)
    console.log(searches.length)
    console.log(JSON.stringify(searches[0]))
    for (let i = 0; i < searches.length; i++) {
        let btnEl = $('<button>')
        let btnText = searches;
        btnEl.text(btnText).addClass("btn search-button btn-secondary col-12 btn-block prevSearch").attr("data-city", btnText);

        $('#history').prepend(btnEl);
    }
} 


// ! Original working code without local storage
// // Add search history button/s
// function searchHistory(city) {
//     let btnEl = $('<button>').text(city).addClass("btn search-button btn-secondary col-12 btn-block prevSearch").attr("data-city", city);
//     $('#history').prepend(btnEl);
//     // TODO Need to add local storage functionality
// }

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


// Main API Call
function getWeatherInfo(geocode) {
    let queryURL = baseURL + geocode + "&appid=" + APIKey + "&units=metric";
    $.ajax({
        url: queryURL,
        method: "GET"
      })
    .then(function(response) {
            let cityNameEl = $('<h3>');
            // Date
            var currentDate = getDateFormat(response.list[0].dt_txt);
            let currentHour = new Date (response.list[0].dt_txt)
            let formattedCurrentHour = currentHour.getHours() + ":00"
            // Add a leading '0' if needed.
            if (formattedCurrentHour.length == 4) {
                formattedCurrentHour = "0" + formattedCurrentHour;
            }
            cityNameEl.text(response.city.name + " (" + currentDate + " - " + formattedCurrentHour + ")")
            // weather icon
            let weatherIconEl = $('<img>');
            weatherIconEl.addClass('src');
            let wIcon = response.list[0].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + wIcon + ".png";
            weatherIconEl.attr("src", iconURL)
            //Add temp, wind and humidity
            let currentTemp = $('<h5>').text("Temp: " + response.list[0].main.temp + " ℃")
            let currentWind = $('<h5>').text("Wind: " + response.list[0].wind.speed + " m/s")
            let currentHumidity = $('<h5>').text("Humidity: " + response.list[0].main.humidity + " %")
            $('#today').empty();
            $('#today').append(cityNameEl, weatherIconEl, currentTemp, currentWind, currentHumidity);

            // FORECAST
            var middayList =[];
            for (let i=0; i < response.list.length; i++) {
                let itemTime = new Date (response.list[i].dt_txt);
                if (itemTime.getHours() === 12) {
                    middayList.push(response.list[i])
                }
            }

            // Clear previous cards
            $('#forecast').empty();

            // Create cards
            for (let j=0; j < middayList.length; j++) {
                // weather icon
                let futureWeatherIconEl = $('<img>');
                futureWeatherIconEl.addClass('src');
                let futurewIcon = response.list[j].weather[0].icon;
                let futureiconURL = "http://openweathermap.org/img/w/" + futurewIcon + ".png";
                futureWeatherIconEl.attr("src", futureiconURL)
                //Add date, temp, wind and humidity
                let futureDate = $('<h5>').text(getDateFormat(middayList[j].dt_txt));
                let futureHour = new Date (middayList[j].dt_txt)
                let formattedFutureHour = $('<h5>').text(futureHour.getHours() + ":00")
                futureDate.addClass("futureDate text-left")
                let forecastTemp = $('<p>').text("Temp: " + middayList[j].main.temp + " ℃")
                let forecastWind = $('<p>').text("Wind: " + middayList[j].wind.speed + " m/s")
                let forecastHumidity = $('<p>').text("Humidity: " + middayList[j].main.humidity + " %")

                // Create forecast cards
                let forecastCard = $('<div>').addClass("card col-2").css("height", "20rem");
                // Add data to card
                forecastCard.append(futureDate, formattedFutureHour, futureWeatherIconEl, forecastTemp, forecastWind, forecastHumidity);
                // Add card to forecast section
                $('#forecast').append(forecastCard)

            }
        })
}

// Call GetLatLong with search term upon submission
$('#search-button').on('click', function (event) {
    // Check there is some value
    if ($('#search-input').val()) {
    event.preventDefault();
    var city = $('#search-input').val().trim();
    // Clear previous search from input area
    $('#search-input').val("");
    searchHistory(city);
    getLatLong(city);
    }
})

// Search using history buttons
$(document).on('click', '.prevSearch', function (event) {
    // Check there is some value
    if ($(this).attr('data-city')) {
    event.preventDefault();
    var city = $(this).attr('data-city');
    // Clear previous search from input area
    getLatLong(city);
    }
})

// Clear History button
$(document).on('click', '#clear-button', function (event) {
    localStorage.clear();  
    drawHistoryBtns();
})
