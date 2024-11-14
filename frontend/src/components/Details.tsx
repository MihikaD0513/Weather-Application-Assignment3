import React from 'react';
import { WeatherData } from '../types/weathertypes';
import { getWeatherName } from '../utils/weatherCodes';

interface DisplayDetailsProps {
  weatherData: WeatherData;
  selectedDate: string;
  city: string;
  state: string;
  onBack: () => void;
}

const DisplayDetails: React.FC<DisplayDetailsProps> = ({ weatherData, selectedDate, city, state, onBack }) => {
  const selectedForecast = weatherData.data.timelines[0].intervals.find(
    interval => interval.startTime.split('T')[0] === selectedDate
  );

  if (!selectedForecast) return null;

  const values = selectedForecast.values;
  const date = new Date(selectedForecast.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  console.log(weatherData);
  console.log(weatherData.latitude, weatherData.longitude);

  const formatTweetContent = () => {
    const temperature = Math.round(values.temperatureMax);
    const weatherCondition = getWeatherName(values.weatherCode);
    const location = `${city || ''}, ${state || ''}`;
    
    return encodeURIComponent(
      `The temperature in ${location} on ${date} is ${temperature}°F and the weather conditions are ${weatherCondition} #CSCI571WeatherForecast`
    );
  };

  const handleTweetClick = () => {
    const tweetContent = formatTweetContent();
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetContent}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="weather-details p-2">
      <div className='d-flex align-items-center position-relative mb-4'>
        <button 
          className="btn btn-outline-dark position-absolute start-0" 
          onClick={onBack}
        >
          <i className="bi bi-arrow-left me-2"></i>
          List
        </button>
        <h5 className="w-100 text-center mb-0" style={{fontWeight: 'bold'}}>{date}</h5>
        <button
          className="btn btn-outline-secondary position-absolute end-0"
          onClick={handleTweetClick}
        >
          
          <i className="bi bi-twitter-x"></i>
        </button>
      </div>

      

      <div className="weather-details-content">
        <table className="table table-striped text-start">
          <tbody>
            <tr>
              <th style={{ width: '35%' }}>Status</th>
              <td>{getWeatherName(values.weatherCode)}</td>
            </tr>
            <tr>
              <th>Max Temperature</th>
              <td>{values.temperatureMax}&deg;F</td>
            </tr>
            <tr>
              <th>Min Temperature</th>
              <td>{Math.round(values.temperatureMin)}&deg;F</td>
            </tr>
            <tr>
              <th>Apparent Temperature</th>
              <td>{Math.round(values.temperatureApparent)}&deg;F</td>
            </tr>
            <tr>
              <th>Sun Rise Time</th>
              <td>{new Date(values.sunriseTime).toLocaleTimeString('en-US', { hour: 'numeric'})}</td>
            </tr>
            <tr>
              <th>Sun Set Time</th>
              <td>{new Date(values.sunsetTime).toLocaleTimeString('en-US', { hour: 'numeric'})}</td>
            </tr>
            <tr>
              <th>Humidity</th>
              <td>{Math.round(values.humidity)}%</td>
            </tr>
            <tr>
              <th>Wind Speed</th>
              <td>{Math.round(values.windSpeed)}mph</td>
            </tr>
            <tr>
              <th>Visibility</th>
              <td>{Math.round(values.visibility)}mi</td>
            </tr>
            <tr>
              <th>Cloud Cover</th>
              <td>{Math.round(values.cloudCover)}%</td>
            </tr>
          </tbody>
        </table>

        <div className="map-container mt-4 mb-2">
          <iframe
            title="Location Map"
            width="100%"
            height="600"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place`
    + `?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    + `&q=${weatherData.latitude},${weatherData.longitude}`
    + `&zoom=15`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayDetails;