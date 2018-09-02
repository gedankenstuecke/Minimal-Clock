import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import * as util from "../common/utils";
import { user } from "user-profile";
import { goals } from "user-activity";
import { battery } from "power";

var months = {0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
              6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}; 

var weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = 'seconds';

// read HR data

let hrLabel = document.getElementById("hrm");
hrLabel.text = "--";
let tempLabel = document.getElementById("tempLabel");
tempLabel.text = "--";

let tempUnitLabel = document.getElementById("tempUnitLabel");
tempUnitLabel.text = "˚C";

let chargeLabel = document.getElementById("chargeLabel");

var hrm = new HeartRateSensor();
hrm.onreading = function() {
  // Peek the current sensor values
  // console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = `${hrm.heartRate}`;
  if (user.heartRateZone(hrm.heartRate) == 'fat-burn') {
    hrLabel.style.fill = '#ffd733';
  } else if (user.heartRateZone(hrm.heartRate) == 'cardio') {
    hrLabel.style.fill = '#f83c40';
  } else if (user.heartRateZone(hrm.heartRate) == 'peak') {
    hrLabel.style.fill = '#f80070';
  } else if (user.heartRateZone(hrm.heartRate) == 'out-of-range') { 
    hrLabel.style.fill = '#38f8df';
  };
}

// Begin monitoring the sensor
hrm.start();

// Get a handle on the <text> elements
const timeLabel = document.getElementById("timeLabel");
let steps = document.getElementById("steps");
let dateLabel = document.getElementById("dateLabel");
let secLabel = document.getElementById("secLabel");
// console.log((today.local.steps || 0) + " steps");

// Update the <text> element every tick with the current time

clock.ontick = (evt) => {
  let today_dt = evt.date;
  let hours = today_dt.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.monoDigits(util.zeroPad(hours));
  };
  let mins = util.monoDigits(util.zeroPad(today_dt.getMinutes()));
  let secs = util.monoDigits(util.zeroPad(today_dt.getSeconds()));
  
  timeLabel.text = `${hours}:${mins}`;  
  secLabel.text = secs;
  
  let month = months[today_dt.getMonth()];
  let weekday = weekdays[today_dt.getDay()];
  let day = today_dt.getDate();
  
  steps.text = (today.adjusted.steps || 0);
  if (steps.text >= (goals.steps || 0)) {
    steps.style.fill = '#b8fc68';    
  } else if (steps.text >= (goals.steps || 0)/2) {
    steps.style.fill = '#ffd733';
  } else {
    steps.style.fill = '#f83478';
  };
  dateLabel.text = `${weekday}, ${month} ${day}`;
  
  let charge = battery.chargeLevel/100;
  chargeLabel.width = 300*charge;
  if (charge < 0.2) {
    chargeLabel.style.fill = '#f83c40'
  } else { 
    chargeLabel.style.fill = '#505050'}
}


// Import the messaging module
import * as messaging from "messaging";

// Request weather data from the companion
function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Display the weather data received from the companion
function processWeatherData(data) {
  // console.log("The temperature is: " + data.temperature);
  let tempLabel = document.getElementById("tempLabel");
  tempLabel.text = `${data.temperature}`;
  var img = document.getElementById("weather");
  img.href = `weather/${data.code}.png`;
  let tempUnitLabel = document.getElementById("tempUnitLabel");
  tempUnitLabel.text = `${data.temp_unit}`;

}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
      if (evt.data['type'] == 'new_weather'){
        processWeatherData(evt.data);
        } else if (evt.data['type'] == 'new_unit') {
          let tempUnitLabel = document.getElementById("tempUnitLabel");
          tempUnitLabel.text = `${evt.data['value']['values'][0]['name']}`;
        }
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the weather every 30 minutes
setInterval(fetchWeather, 30 * 1000 * 60);
