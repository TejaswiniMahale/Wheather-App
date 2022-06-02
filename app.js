const key = "a9f97e4af8263f6c0367aa8155832086";

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeather = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currItems = document.getElementById("current-temp");
let city;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "ThursDay",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  // console.log("time:", time);
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  var hour = time.getHours();
  var ampm;
    if (hour >= 12) {
      ampm = "PM";
    } else {
      ampm = "AM";
    }

  if (hour >= 13) {
    hour = hour % 12;
  }
  

  const minutes = time.getMinutes();
  // const sec = time.getSeconds();

  timeEl.innerHTML =
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

const liveData = () => {
  navigator.geolocation.getCurrentPosition((success) => {
    // console.log('success:', success)
    let lat = success.coords.latitude;
    // console.log('lat:', lat)
    let lon = success.coords.longitude;
    // console.log('lon:', lon)

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${key}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('data:', data)        
        showWeatherData(data);
      });
  });
};
liveData();

async function findCoord() {
  try {
    event.preventDefault();
    let city = document.getElementById("searchData").value;
    // console.log("city:", city);
    // city = "Delhi";
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    );
    let data = await res.json();
    let d = data.coord;
    return d;
  } catch (error) {
    console.log("error:", error);
  }
}

const getData = async () => {
  try {
    let coord = await findCoord();
    console.log("coord:", coord);

    const lati = coord.lat;
    const long = coord.lon;

    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lati}&lon=${long}&exclude=hourly,minutely&appid=${key}&units=metric`
    );
    let data = await res.json();

    showWeatherData(data);
  } catch (error) {
    console.log("error:", error);
  }
};
// getData();
let btn = document.getElementById("search");
btn.addEventListener("click", getData);

function showWeatherData(data) {
  console.log("data:", data);
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = `${data.lat}N ${data.lon}S`;

  document.getElementById(
    "iframe"
  ).src = `https://maps.google.com/maps?q=${data.lat},${data.lon}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;

  currentWeather.innerHTML = `<div class="weather-item">
                <div>Humidity</div>
                <div>${humidity} %</div>
              </div>
              <div class="weather-item">
                <div>Pressure</div>
                <div>${pressure} hPa</div>
              </div>
              <div class="weather-item">
                <div>Wind Speed</div>
                <div>${wind_speed} m/s N</div>
              </div>
              <div class="weather-item">
                <div>Sunrise</div>
                <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
              </div>
              <div class="weather-item">
                <div>Sunset</div>
                <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
              </div>`;

  let otherDayForecast = "";
  daily = data.daily;
  daily.forEach((day, i) => {
    // console.log("day:", day);
    if (i == 0) {
      currItems.innerHTML = `<img src='http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png' alt="weather icon" class="w-icon" />
        <div class="others">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <div class="temp">Day - ${day.temp.day}&#176;C</div>
          <div class="temp">Night - ${day.temp.night}&#176;C</div>
         </div>`;
    } else {
      otherDayForecast += `<div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img src='http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png' alt="weather icon" class="w-icon" />
                  <div class="temp">Day - ${day.temp.day}&#176;C</div>
          <div class="temp">Night - ${day.temp.night}&#176;C</div>
  
        </div>`;
    }
    weatherForecastEl.innerHTML = otherDayForecast;
  });
}
