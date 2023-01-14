import './style.css'
import { ICON_MAP } from './iconMap'
import { getWeather } from './weather'

function getIconUrl(iconCode: number) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon")

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(renderWeather)
  .catch(e => {
    console.error(e)
    alert("Error getting weather")
  })

function renderWeather({ current, daily }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document} = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precipitation)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("daily-temp", day.maxTemp, { parent: element })
    setValue("daily-date", new Date(day.timestamp).toLocaleDateString("en-AU"), { parent: element })
    element.querySelector("[data-icon").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}