$(document).ready(function () {

    function showWeather(response) {
        $("#currentCity").html(response.name + " " + moment().format('MMMM Do YYYY'));
        $("#temp").html(response.main.temp + "°F")
        $("img").insertAfter($("#currentCity")).attr("id", "iconic");
        $("#hum").html(response.main.humidity + "%");
        $("#wind").html(response.wind.speed + "MPH");

        console.log(response);
    }

    function showUV(value) {
        $("#UVin").html(value);
    }

    function displayCities() {
        var storedCities = localStorage.getItem("cityList");
        var parsedStoredCities = JSON.parse(storedCities) || [];
        $('.btn-group-vertical').empty();
        if (parsedStoredCities) {
            for (var i = 0; i < parsedStoredCities.length; i++) {
                var container = $(`<button type="button" class="btn btn-light cities" id="${parsedStoredCities[i]}"></button>`).text(parsedStoredCities[i]);
                $(".btn-group-vertical").prepend(container);
            }
        }
    }

    function showForecast(response) {
        var forecast = response.list;
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {
            var currentObject = forecast[i];
            var dt_time = currentObject.dt_txt.split(' ')[1]
            if (dt_time === "12:00:00") {
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

    function search(cityTerm) {
        var storedCities = localStorage.getItem("cityList");
        var parsedStoredCities = JSON.parse(storedCities) || [];
        if (cityTerm) {
            if (!parsedStoredCities.includes(cityTerm)) {
                parsedStoredCities.push(cityTerm);
            }
            localStorage.setItem("cityList", JSON.stringify(parsedStoredCities));
            displayCities(parsedStoredCities);

            const APIKey = "5efca13a1862000a30cd6a2b448eaaa5";
            var currentCityWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityTerm + "&appid=" + APIKey;
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTerm + "&units=imperial" + "&appid=" + APIKey;
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey;
            $.ajax({
                url: currentCityWeatherURL,
                method: "GET"
            }).then(function (response) {
                showWeather(response);
                uvIndexURL += "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            }).then(function () {
                $.ajax({
                    url: uvIndexURL,
                    method: "GET"
                }).then(function (response) {
                    showUV(response.value);
                })
            }).then(function () {
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (response) {
                    showForecast(response)
                });
            });
        } else {
            $('#error').html('Please insert a city name:');
        }
    }

    $('#searchBtn').click(function (event) {
        event.preventDefault();
        var cityTerm = $("#cityTerm").val().trim();
        search(cityTerm);

    });
    displayCities();
    $('.cities').each(function () {
        $(this).on("click", function (event) {
            console.log("called");
            var cityTerm = $(this).attr("id");
            console.log(cityTerm);
            search(cityTerm);
        }); 
    });
})   
