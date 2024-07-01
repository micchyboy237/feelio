import axios from 'axios'

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: latitude,
        longitude: longitude,
        current_weather: true,
      },
    })
    return response.data
  } catch (error) {
    console.log('Error fetching weather data:', error)
  }
}
