var weather;
var api = 'https://api.openweathermap.org/data/2.5/forecast?';
var apiKey = ''
var apiKey2 = ''
var unitsI = '&units=imperial';
var unitsM = '&units=metric';

//mouse button click event
var button = document.getElementById('compare');
button.addEventListener('click', function() {
  var city1 = document.getElementById('city1').value;
  var city2 = document.getElementById('city2').value;
  var state1 = document.getElementById('state1').value;
  var state2 = document.getElementById('state2').value;
  var units = document.querySelector('input[name="units"]:checked');

  if (city1 && city2 && state1 && state2 && units) {
    if (units.value === 'metric') {
      getWeathers(city1, city2, state1, state2, 'metric');
    } else if (units.value === 'imperial') {
      getWeathers(city1, city2, state1, state2, 'imperial');
    }
  } else {
    alert('Please fill in all fields before comparing, or double check if the city exists.');
  }
});

function getWeathers(city1, city2, state1, state2, units) {
  var city1Url = api + 'q=' + city1 + ',' + state1 + '&appid=' + apiKey + '&units=' + units;
  var city2Url = api + 'q=' + city2 + ',' + state2 + '&appid=' + apiKey + '&units=' + units;

  fetch(city1Url)
    .then(response => response.json())
    .then(data => {
      console.log('City 1 Data:', data); // Log the data for debugging
      if (data.cod === "200") {
        updateTable(data, 'city1-weather');
      } else {
        console.error('Error fetching data for city 1:', data.message);
        alert(`Error fetching data for city 1: ${data.message}`);
      }
    })
    .catch(error => console.error('Error fetching data for city 1:', error));

  fetch(city2Url)
    .then(response => response.json())
    .then(data => {
      console.log('City 2 Data:', data); // Log the data for debugging
      if (data.cod === "200") {
        updateTable(data, 'city2-weather');
      } else {
        console.error('Error fetching data for city 2:', data.message);
        alert(`Error fetching data for city 2: ${data.message}`);
      }
    })
    .catch(error => console.error('Error fetching data for city 2:', error));
}

// Updating the table
function updateTable(data, tableId) {
  var tableBody = document.getElementById(tableId).querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing data

  // Getting the data
  if (data.list) {
    var forecasts = data.list.slice(0, 5);
    var startDay = new Date(forecasts[0].dt * 1000).getDay(); // Get the starting day of the first forecast
    forecasts.forEach((forecast, index) => {
      var row = document.createElement('tr');
      var date = new Date(forecast.dt * 1000);
      var dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(startDay + index) % 7]; // Calculate the day of the week in order
      var tempHigh = forecast.main.temp_max;
      var tempLow = forecast.main.temp_min;
      var weatherIcon = forecast.weather[0].icon; // Get the weather icon
      var weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`; // Construct the icon URL

      row.innerHTML = `
        <td>${dayOfWeek}</td>
        <td>${tempHigh}&deg;</td>
        <td>${tempLow}&deg;</td>
        <td><img src="${weatherIconUrl}" alt="Weather icon"></td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    console.error('Data does not contain list property:', data);
  }
}

// Updating the table units
function updateTableUnits(units) {
  var unitSymbol = units === 'metric' ? '&deg;C' : '&deg;F';
  document.getElementById('city1-temp-unit').innerHTML = `Temperature (${unitSymbol})`;
  document.getElementById('city2-temp-unit').innerHTML = `Temperature (${unitSymbol})`;
}
