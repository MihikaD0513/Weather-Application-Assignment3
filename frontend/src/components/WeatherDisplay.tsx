import React from 'react';
import { WeatherData } from '../types/weathertypes';
import { getWeatherName, getWeatherPath } from '../utils/weatherCodes';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  onDateClick: (date: string) => void;
  
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, onDateClick }) => {

    const dailyForecasts = weatherData.data.timelines[0].intervals;
  
    return (
      <div className="weather-display">
        
        <table className="table">
          <thead>
            <tr>
              <th scope='col' style={{ width: "5%" }}>#</th>
              <th className='text-start'>Date</th>
              <th scope='col'>Status</th>
              <th scope='col'>Temp. High (&deg;F)</th>
              <th scope='col'>Temp. Low (&deg;F)</th>
              <th scope='col'>Wind Speed (mph)</th>
            </tr>
          </thead>
          <tbody>
            {dailyForecasts.map((forecast, index) => {
              const values = forecast.values;
              const date = new Date(forecast.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const dateString = forecast.startTime.split('T')[0];
              const status = values.weatherCode; 
              const highTemp = Math.round(values.temperatureMax);
              const lowTemp = Math.round(values.temperatureMin);
              const windSpeed = Math.round(values.windSpeed);
  
              return (
                <tr key={index}>
                  <td style={{ width: "5%" }}>{index + 1}</td>
                  <td className='text-start'><button
                    onClick={(e) => {
                      e.preventDefault();
                      onDateClick(dateString);
                    }}
                    className="btn btn-link text-start"
                    
                  >
                    {date}
                  </button></td>
                  <td className='me-0 p-0'><img src={getWeatherPath(status)} alt={getWeatherName(status)} height={"9%"} width={"9%"} />
                  {getWeatherName(status)}</td>
                  <td>{highTemp}</td>
                  <td>{lowTemp}</td>
                  <td>{windSpeed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default WeatherDisplay;