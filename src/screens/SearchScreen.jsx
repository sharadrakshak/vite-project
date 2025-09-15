import React, { useState } from 'react';
import WeatherIcon from '../Components/WeatherIcon';
import ForecastCard from '../Components/ForecastCard';

export default function SearchScreen({ onBack }) {
  const [cityInput, setCityInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cityInput) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Error fetching weather');
      }
      const data = await resp.json();
      setWeather(data);

      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        const daily = fcData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5);
        setForecast(daily);
      } else {
        console.warn('Forecast fetch failed during search:', fcResp.status);
      }

      setError(null);
    } catch (err) {
      console.error('Error in SearchScreen handleSearch:', err);
      setError('City not found or error fetching data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button onClick={onBack}>Back</button>

      <form onSubmit={handleSearch} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Search
        </button>
      </form>

      {loading && <div style={{ marginTop: '20px' }}>Loading…</div>}
      {error && <div style={{ marginTop: '20px', color: 'red' }}>{error}</div>}

      {weather && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <WeatherIcon condition={weather.weather[0].main} size={80} />
          <div style={{ fontSize: '36px', margin: '10px 0' }}>
            {Math.round(weather.main.temp)}°C
          </div>
          <div>{weather.weather[0].description}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div>Humidity: {weather.main.humidity}%</div>
            <div>Wind: {weather.wind.speed} m/s</div>
          </div>

          {forecast.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2>5-Day Forecast</h2>
              <div style={{ display: 'flex', overflowX: 'auto' }}>
                {forecast.map((f, idx) => (
                  <ForecastCard
                    key={idx}
                    date={new Date(f.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
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
  );
}
