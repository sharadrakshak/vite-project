import React, { useEffect, useState } from "react";
import WeatherIcon from "../Components/WeatherIcon";
import ForecastCard from "../Components/ForecastCard";
import "../Styles.css";

const DEFAULT_CITY = "Jaipur";

export default function MainScreen({ onSearch }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Error fetching weather by coords");
      }
      const data = await resp.json();
      setWeather(data);

      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        const daily = fcData.list
          .filter((item, idx) => idx % 8 === 0)
          .slice(0, 5);
        setForecast(daily);
      } else {
        console.warn("Forecast fetch by coords failed:", fcResp.status);
      }
      setError(null);
    } catch (err) {
      console.error("Error in fetchWeatherByCoords:", err);
      fetchWeatherByCity(DEFAULT_CITY);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Error fetching weather by city");
      }
      const data = await resp.json();
      setWeather(data);

      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        const daily = fcData.list
          .filter((item, idx) => idx % 8 === 0)
          .slice(0, 5);
        setForecast(daily);
      } else {
        console.warn("Forecast fetch by city failed:", fcResp.status);
      }
      setError(null);
    } catch (err) {
      console.error("Error in fetchWeatherByCity:", err);
      setError("Could not fetch weather data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiKey) {
      setError("API Key is missing");
      setLoading(false);
      return;
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (Err) => {
          console.warn("Geolocation error:", Err);
          fetchWeatherByCity(DEFAULT_CITY);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  }, []);

  if (loading) {
    return <div className="loading-message">Loading weather...</div>;
  }
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}
      {weather && (
        <div>
          <div className="header">
            <h1 className="city-name">{weather.name}</h1>
            <button className="search-button" onClick={onSearch}>
              Search City
            </button>
          </div>

          <div className="weather-card">
            {console.log(weather)}
            {/* <WeatherIcon condition={weather.weather[0].main} size={100} />
             */}
            <img
              src={iconUrl}
              alt={""} 
            />
            <div className="temperature">{Math.round(weather.main.temp)}°C</div>
            <div className="condition">{weather.weather[0].description}</div>

            <div className="details">
              <div className="detail-item">
                Humidity: {weather.main.humidity}%
              </div>
              <div className="detail-item">Wind: {weather.wind.speed} m/s</div>
            </div>
          </div>

          {forecast.length > 0 && (
            <div className="forecast-container">
              <h2 className="forecast-title">5-Day Forecast</h2>
              <div className="forecast-cards">
                {forecast.map((f, idx) => (
                  <ForecastCard
                    key={idx}
                    date={new Date(f.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                    min={f.main.temp_min}
                    max={f.main.temp_max}
                    condition={f.weather[0].main}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!weather && !error && (
        <div className="error-message">
          <h1>Weather not available</h1>
        </div>
      )}
    </div>
  );
}
