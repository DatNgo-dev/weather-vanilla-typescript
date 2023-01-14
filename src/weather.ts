import axios from "axios";

export function getWeather(lat: number, lon: number, timezone: unknown) {
    return axios.get("https://api.open-meteo.com/v1/forecast?daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime", { 
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
        }
    }).then(({data}) => {
        
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
        }
    })
}

function parseCurrentWeather({ current_weather, daily }) {
    const { 
        temperature: currentTemp, 
        windspeed: windSpeed, 
        weathercode: iconCode
    } = current_weather

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precipitation],
    } = daily

    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precipitation: Math.round(precipitation * 100) / 100,
        iconCode
    }
}

function parseDailyWeather({ current_weather, daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index])
        }
    })
}