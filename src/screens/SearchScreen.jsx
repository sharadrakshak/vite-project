import React, { useState } from "react";
import WeatherIcon from "../Components/WeatherIcon";
import ForecastCard from "../Components/ForecastCard";
import "../Styles.css";

export default function SearchScreen({ onBack }) {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null); // reset previous
    setForecast([]);
    setCityInput("")

    try {
      const query = encodeURIComponent(cityInput.trim());

      // fetch current weather
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );
      if (!resp.ok) {
        const errJson = await resp.json();
        throw new Error(errJson.message || "Error fetching weather");
      }
      const data = await resp.json();
      setWeather(data);

      // fetch forecast
      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        const daily = fcData.list
          .filter((item, idx) => idx % 8 === 0)
          .slice(0, 5);
        setForecast(daily);
      } else {
        console.warn("Forecast fetch failed during search:", fcResp.status);
      }

      setError(null);
    } catch (err) {
      console.error("Error in SearchScreen handleSearch:", err);
      setError("City not found");
    } finally {
      setLoading(false);
    }
  };
  const iconUrl = `https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`;

  {
    console.log(weather?.weather[0]);
  }
  return (
    <>
      {weather ? (
        <img
          className="background-image"
          src={`./${weather?.weather[0].main}.png`}
        />
      ) : (
        ""
      )}
      <div className="app-container">
        <div className="search-header">
          <button className="search-button back-btn" onClick={onBack}>
            ←
          </button>

          <form onSubmit={handleSearch} className="input-group">
            <input
              type="text"
              placeholder="Enter city name"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              required
            />
            <button type="submit">Search</button> 
          </form>
        </div>

        {loading && <div className="loading-message"><h1>Loading…</h1></div>}
        {error && <h1 className="error-message">{error}</h1>}

        {weather && (
          <div className="search-weather-card">
            <div className="header" style={{ justifyContent: "center" }}>
              <h1 className="city-name">{weather.name}</h1>
            </div>
            {/* <WeatherIcon condition={weather.weather[0].main} size={80} /> */}
            <img src={iconUrl} alt={""} />
            <div className="temperature">{Math.round(weather.main.temp)}°C</div>
            <div className="condition">{weather.weather[0].description}</div>

            <div className="details">
              <div className="detail-item">
                Humidity: {weather.main.humidity}%
              </div>
              <div className="detail-item">Wind: {weather.wind.speed} m/s</div>
            </div>

            {forecast.length > 0 && (
              <div className="forecast-container">
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
      </div>
    </>
  );
}
