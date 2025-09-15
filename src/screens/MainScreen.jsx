import React, { useEffect, useState } from 'react';
import WeatherIcon from '../Components/WeatherIcon';
import ForecastCard from '../Components/ForecastCard';

const DEFAULT_CITY = 'Jaipur';

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
        throw new Error(err.message || 'Error fetching weather by coords');
      }
      const data = await resp.json();
      setWeather(data);

      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        // pick 5 forecasts at e.g. every 8 steps (3h increments in forecast data)
        const daily = fcData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5);
        setForecast(daily);
      } else {
        console.warn('Forecast fetch by coords failed:', fcResp.status);
      }

      setError(null);
    } catch (err) {
      console.error('Error in fetchWeatherByCoords:', err);
      // fallback
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
        throw new Error(err.message || 'Error fetching weather by city');
      }
      const data = await resp.json();
      setWeather(data);

      const fcResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      if (fcResp.ok) {
        const fcData = await fcResp.json();
        const daily = fcData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5);
        setForecast(daily);
      } else {
        console.warn('Forecast fetch by city failed:', fcResp.status);
      }

      setError(null);
    } catch (err) {
      console.error('Error in fetchWeatherByCity:', err);
      setError('Could not fetch weather data right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiKey) {
      setError('API Key is missing');
      setLoading(false);
      return;
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (geoErr) => {
          console.warn('Geolocation error:', geoErr);
          fetchWeatherByCity(DEFAULT_CITY);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  }, [apiKey]);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {weather && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>{weather.name}</h1>
            <button onClick={onSearch}>Search City</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <WeatherIcon condition={weather.weather[0].main} size={100} />
            <div style={{ fontSize: '48px', margin: '10px 0' }}>
              {Math.round(weather.main.temp)}°C
            </div>
            <div style={{ fontSize: '24px' }}>
              {weather.weather[0].description}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
              <div>Humidity: {weather.main.humidity}%</div>
              <div>Wind: {weather.wind.speed} m/s</div>
            </div>
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

      {!weather && (
        <div>
          <h1>Weather not available</h1>
          <p>Showing default city: {DEFAULT_CITY}</p>
        </div>
      )}
    </div>
  );
}
