const apiKey = "5f85d48f175b1ca8264a36f9cce71dc6";

const weatherDiv = document.getElementById("weather");

// ---------------- AUTOCOMPLETE ----------------
fetch("https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("cityList");
    data.forEach(city => {
      const opt = document.createElement("option");
      opt.value = city.name;
      list.appendChild(opt);
    });
  });

// ---------------- SEARCH EVENT ----------------
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather(city);
});

// ---------------- MAIN FETCH FUNCTION ----------------
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod == "404") {
      weatherDiv.innerHTML = `<p>❌ City not found</p>`;
      return;
    }

    renderWeather(data);

    // Save cache per city
    localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify(data));

  } catch (err) {
    const cached = localStorage.getItem(`weather_${city.toLowerCase()}`);
    if (cached) {
      renderWeather(JSON.parse(cached), true);
    } else {
      weatherDiv.innerHTML = `<p>No internet & no cached data 😥</p>`;
    }
  }
}

function renderWeather(data, offline = false) {
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ Temp: ${data.main.temp.toFixed(1)}°C</p>
    <p>🤔 Feels like: ${data.main.feels_like.toFixed(1)}°C</p>
    <p>🌥️ Weather: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    ${offline ? "<p style='color:red'>Offline (cached)</p>" : ""}
  `;

  const weatherType = data.weather[0].main.toLowerCase(); 

  changeVideo(weatherType);

  switch (weatherType) {
    case "clear":
      document.body.classList.add("clear");
      break;
    case "clouds":
      document.body.classList.add("clouds");
      break;
    case "rain":
      document.body.classList.add("rain");
      break;
    case "drizzle":
      document.body.classList.add("drizzle");
      break;
    case "thunderstorm":
      document.body.classList.add("thunderstorm");
      break;
    case "snow":
      document.body.classList.add("snow");
      break;
    case "mist":
    case "fog":
    case "haze":
    case "dust":
    case "smoke":
    case "sand":
    case "ash":
      document.body.classList.add("atmosphere");
      break;
    default:
      document.body.classList.add("default-bg");
}
}

function changeVideo(weatherType) {
  const video = document.getElementById("bgVideo");

  let file = "default.mp4";

  switch (weatherType) {
    case "clear": file = "sunny.mp4"; break;
    case "clouds": file = "cloudy.mp4"; break;
    case "rain": file = "heavy_rain.mp4"; break;
    case "drizzle": file = "light_rain.mp4"; break;
    case "thunderstorm": file = "storm.mp4"; break;
    case "snow": file = "snowy.mp4"; break;
    case "mist":
    case "fog":
    case "haze":
      file = "fog.mp4";
      break;
  }

  video.src = `video/${file}`;
  video.playbackRate = 0.5;
}
