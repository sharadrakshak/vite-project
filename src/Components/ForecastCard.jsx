import React from 'react';
import WeatherIcon from './WeatherIcon';
import "../Styles.css";

export default function ForecastCard({ date, min, max, condition }) {
  return (
    <div className="forecast-card">
      <div className="weekday">{date}</div>
      <WeatherIcon condition={condition} size={40} />
      <div className="temp-range">
        {Math.round(max)}° / {Math.round(min)}°
      </div>
    </div>
  );
}
