import React, { useEffect, useState } from "react";
import "./App.css";

const WeatherApp = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  
  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      alert("Please enter a city name");
      return;
    }

    setLoading(true);
    console.log("Fetching weather for city:", city);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      console.log("Weather data fetched for city:", data);

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("City not found");
        setWeather(null);
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Something went wrong");
      setWeather(null);
    }
    setLoading(false);
  };

  
  const fetchWeatherByCoordinates = async (lat, lon) => {
    console.log("Fetching weather for coordinates:", lat, lon);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      console.log("Weather data fetched by coordinates:", data);

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("Weather not found");
        setWeather(null);
      }
    } catch (err) {
      console.error("Error fetching weather by coordinates:", err);
      setError("Something went wrong");
      setWeather(null);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    console.log("Requesting user location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location tracked:", latitude, longitude);
        fetchWeatherByCoordinates(latitude, longitude);
      },
      () => {
        console.error("Location permission denied");
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="weather-container">
      <h2>🌤️ Weather App</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeatherByCity()}
        />
        <button onClick={fetchWeatherByCity}>Search</button>
      </div>

      {loading ? (
        <p className="loading">Loading weather data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : weather ? (
        <div className="weather-card">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>🥵 Feels Like: {weather.main.feels_like}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
          <p>🕓 Time: {new Date().toLocaleTimeString()}</p>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherApp;
