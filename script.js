const API_KEY = '1d0008fb5b5d15876b74b930fa7cd34d'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/'
const KELVIN_TO_CELSIUS = 273.15

function showAlert (title, text, icon = 'warning') {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: '#007BFF'
  })
}

function fetchWeatherData (city) {
  const encodedCity = encodeURIComponent(city)
  const currentWeatherUrl = `${BASE_URL}weather?q=${encodedCity}&appid=${API_KEY}`
  return fetch(currentWeatherUrl)
    .then(response => response.json())
    .catch(error => {
      console.error('Помилка отримання даних про погоду:', error)
      showAlert(
        'Помилка',
        'Не вдалося отримати дані про погоду. Спробуйте ще раз.',
        'error'
      )
      return null
    })
}

function fetchHourlyForecast (city) {
  const encodedCity = encodeURIComponent(city)
  const forecastUrl = `${BASE_URL}forecast?q=${encodedCity}&appid=${API_KEY}`
  return fetch(forecastUrl)
    .then(response => response.json())
    .then(data => data.list)
    .catch(error => {
      console.error('Помилка отримання прогнозу погоди:', error)
      showAlert(
        'Помилка',
        'Не вдалося отримати прогноз погоди. Спробуйте ще раз.',
        'error'
      )
      return []
    })
}

function getWeather () {
  const city = document.getElementById('city').value.trim()
  if (!city) {
    showAlert('Помилка вводу', 'Будь ласка, введіть місто', 'warning')
    return
  }

  fetchWeatherData(city).then(data => {
    if (data && data.cod !== '404') {
      displayWeather(data)
      fetchHourlyForecast(city).then(displayHourlyForecast)
    } else {
      showAlert(
        'Місто не знайдено',
        data?.message || 'Місто не знайдено',
        'error'
      )
    }
  })
}

function displayWeather (data) {
  const tempDivInfo = document.getElementById('temp-div')
  const weatherInfoDiv = document.getElementById('weather-info')
  const weatherIcon = document.getElementById('weather-icon')

  tempDivInfo.innerHTML = ''
  weatherInfoDiv.innerHTML = ''

  const cityName = data.name
  const temperature = Math.round(data.main.temp - KELVIN_TO_CELSIUS)
  const description = data.weather[0].description
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`

  tempDivInfo.innerHTML = `<p>${temperature}°C</p>`
  weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`
  weatherIcon.src = iconUrl
  weatherIcon.alt = description
  weatherIcon.style.display = 'block'
}

function displayHourlyForecast (hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast')
  hourlyForecastDiv.innerHTML = ''
  const next24Hours = hourlyData.slice(0, 8)
  next24Hours.forEach(item => {
    const hour = new Date(item.dt * 1000).getHours()
    const temperature = Math.round(item.main.temp - KELVIN_TO_CELSIUS)
    const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`
    hourlyForecastDiv.innerHTML += `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Іконка погоди">
        <span>${temperature}°C</span>
      </div>`
  })
}
