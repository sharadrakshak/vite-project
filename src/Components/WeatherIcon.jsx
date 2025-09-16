 
import React from 'react';
import '../Styles.css';

const iconMap = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Snow: '❄️',
  Thunderstorm: '⛈️',
  Haze: '🌫️',
  Mist: '🌫️',
  Smoke: '🌫️',
  // etc.
};

export default function WeatherIcon({ condition, size = 80 }) {
  const icon = iconMap[condition] || '❓';
  return (
    <div className="weather-icon-emoji" style={{ fontSize: size }}>
      {icon}
    </div>
  );
}
