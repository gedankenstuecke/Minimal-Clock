import { geolocation } from "geolocation";
import * as messaging from "messaging";

function queryLocationWeather(){
  geolocation.getCurrentPosition(queryWeather, locationError);
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Fetch the weather from OpenWeather
function queryWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let yahoo_query= `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20u%3D'c'%20and%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(${lat}%2C${lon})%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
  fetch(yahoo_query)
  .then(function (response) {
      response.json()
      .then(function(data) {
        //console.log(data['query']['results']['channel']['item']['condition']);
        // We just want the current temperature & image code
        var weather = {
          temperature: data['query']['results']['channel']['item']['condition']['temp'],
          code: data['query']['results']['channel']['item']['condition']['code']
        }
        // Send the weather data to the device
        returnWeatherData(weather)
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weather") {
    // The device requested weather data
    queryLocationWeather();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
