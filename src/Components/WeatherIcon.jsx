// maps weather condition main to an icon (you can replace with images later)
import React from 'react';

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
    <div style={{ fontSize: size }}>
      {icon}
    </div>
  );
}
