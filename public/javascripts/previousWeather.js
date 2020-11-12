// Ensure the JS code is loaded before running
$(document).ready(function () {});

// Want to get the text input
const nameInput = document.getElementById("input");
document
  .querySelector("form.search-form")
  //   On submit event on the form
  .addEventListener("submit", function (e) {
    //prevent the normal submission of the form
    e.preventDefault();
    // Retrieving the API with the unique API key
    $.getJSON(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        nameInput.value +
        ",us&units=imperial&appid=c0c35b925bbddaaf1dca134adf31f13a",
      function (data) {
        console.log(data);
        let date = data.dt;
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        // Retrieving the previous date
        var prev_date = new Date();
        prev_date.setDate(prev_date.getDate() - 1);

        prev_date.toDateString();

        // Covert to unix time stamp
        let previous = Math.floor(prev_date / 1000);

        $.getJSON(
          "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" +
            lat +
            "&lon=" +
            lon +
            "&dt=" +
            previous +
            "&units=imperial&appid=c0c35b925bbddaaf1dca134adf31f13a",
          function (api) {
            console.log(api);

            let icon =
              "https://openweathermap.org/img/w/" +
              api.current.weather[0].icon +
              ".png";
            $(".icon").attr("src", icon);

            let temp = Math.floor(api.current.temp);
            $(".temp").append(temp + "&deg;");

            let weather = api.current.weather[0].main;
            $(".condition").append(weather);

            // select city class and append the user location
            let location = data.name;
            $(".city").append(location + " Previous weather");
            $(".prevDate").append("as of " + prev_date.toDateString());

            // Change the background image and color depending on the weather condition.
            if (weather === "Clear") {
              document.body.style.backgroundImage =
                "url('images/clearSky.jpg')";
              document.getElementById("container").style.background = "#6691BB";
            } else if (weather === "Rain") {
              document.body.style.backgroundImage = "url('images/rain.jpg')";
              document.getElementById("container").style.background =
                "linear-gradient(180deg, rgba(127, 123, 130, 1) 0%, #3c3c3c 100%";
            } else if (weather === "Clouds") {
              document.body.style.backgroundImage = "url('images/cloudy.jpg')";
              document.getElementById("container").style.background = "#465367";
            } else if (weather === "Thunderstorm") {
              document.body.style.backgroundImage = "url('images/thunder.jpg')";
              document.getElementById("container").style.background = "#78777F";
            } else if (weather === "Snow") {
              document.body.style.backgroundImage = "url('images/snow.jpg')";
              document.getElementById("container").style.background = "#759AAC";
            } else if (weather === "Fog" || weather === "Mist") {
              document.body.style.backgroundImage = "url('images/fog.jpg')";
              document.getElementById("container").style.background = "#78777F";
            }

            // Select the wind class and append the current wind speed
            let wind = data.wind.speed;
            $(".wind").append(wind + " mph");

            // Select the sunrise class
            let rise = api.current.sunrise;
            var date = new Date(rise * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Display time in 10:20 format
            var formattedTime = hours + ":" + minutes.substr(-2);
            // append the time the sun rose
            $(".sunrise").append(formattedTime + " am");

            // Select the sunset class
            let set = api.current.sunset;
            var date = new Date(set * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();

            hours = hours % 12 || 12;
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Display time in 10:20 format
            var formattedTime = hours + ":" + minutes.substr(-2);
            // append the time the sun rose
            $(".sunset").append(formattedTime + " pm");
          }
        );
      }
    );
  });

//   Allows only one submission. One problem users have to refresh the page to submit again
$("form").submit(function () {
  $("input[type=submit]", this).attr("disabled", "disabled");
});