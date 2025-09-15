import React from 'react';
import WeatherIcon from './WeatherIcon';

export default function ForecastCard({ date, min, max, condition }) {
  return (
    <div style={{
      flex: '1 1 0',
      margin: '0 5px',
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      textAlign: 'center'
    }}>
      <div>{date}</div>
      <WeatherIcon condition={condition} size={40} />
      <div>{Math.round(max)}° / {Math.round(min)}°</div>
    </div>
  );
}
