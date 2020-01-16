$(document).ready(function() {
    function showWeather(response) {
        $("#currentCity").html(response.name);
        $("#temp").html(response.main.temp + "°F")
        $("#hum").html(response.main.humidity + "%");
        $("#wind").html(response.wind.speed + "MPH");
        console.log(response);
    }

    function showUV(response) {
        var lat = response.lat;
        var lon = response.lon;
        $("#UVin").html(response.value);
    }

    function showForecast(response) {
        var forecast = response.list;
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {
            var currentObject = forecast[i];
            // '12:00:00'[1] is the number of index]
            var dt_time = currentObject.dt_txt.split(' ')[1] 
            // At each index..If...dt_txt === "12:00:00" get info
            if (dt_time === "12:00:00") {
                // currentObject.main ... time, icon, temp, humidity
                var main = currentObject.main;
                var temp = main.temp; 
                var humidity = main.humidity;
                var date = moment(currentObject.dt_txt).format('l'); 
                var icon = currentObject.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
                <div class="col">
                    <div class="card">
                        <div class="card-body five-day">
                            <p><strong>${date}</strong></p>
                            <div><img src=${iconurl} /></div>
                            <p>Temp: ${temp} °F</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    </div> 
                </div>`;
                currentForecast.push(htmlTemplate);
                }
            }
        $("#fiveDay").html(currentForecast.join(''));
    }
    

    $('#searchBtn').click(function (event) {
        event.preventDefault();
            var cityTerm = $("#cityTerm").val();
            var cityTerm = cityTerm.trim();
            const APIKey = "5efca13a1862000a30cd6a2b448eaaa5";
            var currentCityWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityTerm + "&appid=" + APIKey;
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTerm + "&units=imperial" + "&appid=" + APIKey;
            if (cityTerm != "") {

                $.ajax({
                    url: currentCityWeatherURL,
                    method: "GET"
                    }).then (function (response) {
                        showWeather(response);
                        getUVIndex(response.coord.lon, response.coord.lat);
                    });
                function getUVIndex(lon, lat){
                    var UVIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat=" + lat + "&lon=" + lon;
                    $.ajax({
                        url: UVIndexURL,
                        method: "GET"
                        }).then (function (response) {
                            showUV(response);
                        })
                }

                $.ajax({
                    url: forecastURL,
                    method: "GET"
                    }).then (function (response) {
                        showForecast(response)
                    });

            } else {
            $('#error').html('Please insert a city name:');
        }
        
    });
})   
