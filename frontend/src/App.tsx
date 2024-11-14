import React, { useState, useEffect } from 'react';
import { WeatherData, Location, Favorite } from './types/weathertypes';
import { getFavorites, addFavorite, getLocationCoordinates, getWeatherData, checkFavorite as apiCheckFavorite, deleteFavorite } from './api/weatherApi';
import SearchForm from './components/SearchForm';
import WeatherTabs from './components/WeatherTabs';
import LoadingBar from './components/LoadingBar';
import WeatherDisplay from './components/WeatherDisplay';
import FavoritesList from './components/FavoritesList';
import DisplayDetails from './components/Details';
import { IoIosArrowForward } from "react-icons/io";
import TemperatureChart from './components/TemperatureChart';
import MeteogramChartComponent from './components/MeteogramChart';
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

import './App.css';

const App: React.FC = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState('');
  const [detectedState, setDetectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('results');
  const [activeInnerTab, setActiveInnerTab] = useState('day view');
  const [location, setLocation] = useState<Location | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [starFilled, setStarFilled] = useState(false);

  useEffect(() => {
    const handleCurrentLocation = () => {
      if (useCurrentLocation) {
        setLoading(true);
        fetch(`https://ipinfo.io/json?token=${process.env.REACT_APP_IP_INFO_TOKEN}`)
          .then(response => response.json())
          .then(data => {
            const [lat, lng] = data.loc.split(',').map(Number);
            setDetectedCity(data.city);
            setDetectedState(data.region);
            setLocation({ lat, lng });
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching location:', error);
            setLoading(false);
          });
      } else {
        setLocation(null);
        setDetectedCity('');
        setDetectedState('');
      }
    };

    if (useCurrentLocation) {
      handleCurrentLocation();
    }
  }, [useCurrentLocation]);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }; 

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let lat, lng;
      if (!useCurrentLocation) {
        const locationData = await getLocationCoordinates(`${street}, ${city}, ${state}`);
        lat = locationData.lat;
        lng = locationData.lng;
      } else {
        lat = location?.lat;
        lng = location?.lng;
        setCity(detectedCity);
        setState(detectedState);
      }

      const data = await getWeatherData(lat!, lng!);
      setWeatherData(data);
      checkFavoriteStatus(city, state);
      setActiveTab('results');
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('An error occured please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setStreet('');
    setCity('');
    setState('');
    setUseCurrentLocation(false);
    setWeatherData(null);
    setLocation(null);
  };

  const checkFavoriteStatus = async (city: string, state: string) => {
    try {
      const data = await apiCheckFavorite(city, state);
      setStarFilled(data.isFavorite);
      if (starFilled) {
        setFavoriteId(data.favoriteId);
      } else {
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }

  const handleAddFavorite = async () => {
    if (!city || !state) return;
    if (starFilled) {
      setSavingFavorite(false);
      if (favoriteId) {
        await deleteFavorite(favoriteId);
        setFavoriteId(null);
        setFavorites(prevFavorites => 
          prevFavorites.filter(fav => fav._id !== favoriteId)
        );
      }
      setStarFilled(!starFilled);
    } else {
      const newFavorite = await addFavorite(city, state);
        setStarFilled(true);
        setFavoriteId(newFavorite._id);
        setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
    }
    
  };

  useEffect(() => {
    setStarFilled(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async () => {
    try {
      await handleAddFavorite();
      setStarFilled(!starFilled);
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  }

  const renderToggleButtons = () => {
    return (
      <div className="flex space-x-4 mt-8 mb-8 justify-center">
            <button
              type="button"
              className={`${
                activeTab === 'results' 
                  ? 'btn btn-primary' 
                  : 'btn-not-active'
              }`}
              onClick={() => setActiveTab('results')}
            >
              Results
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'favorites' 
                  ? 'btn btn-primary' 
                  : 'btn-not-active'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
          </div>
    );
  };


  const renderResultsContent = () => {
    if (!weatherData) return null;
    
    if (error) {
      return (
      <div className='alert alert-danger justify-content-start'>{error}</div>
    );
  }

    return (
      
      <div className='page-container'>
        <div className={`page-content results-page ${showDetails ? 'exit' : ''}`}>
          {!showDetails ? (
            <>
            <h4 className='forecastheading'>Forecast at {city}, {state}</h4>
            <div className='d-flex justify-content-end'>
            <button
                      className="btn btn-outline-secondary mt-3"
                      onClick={handleFavoriteClick}
                      disabled={savingFavorite || !city || !state}
                    >
                      {starFilled ? (
                        <AiFillStar size={24} color='gold' style={{stroke: 'black', strokeWidth: '30px'}} />
                      ) : (
                        <AiOutlineStar size={24} color='black'/>
                      )}
                      
                    </button>
                    <button
                    className="btn btn-link"
                    onClick={() => {
                      const firstDate = weatherData.data.timelines[0].intervals[0].startTime.split('T')[0];
                      setSelectedDate(selectedDate || firstDate);
                      setShowDetails(true);
                    }}
                    style={{color: 'black'}}
                  >
                    Details <IoIosArrowForward />
                  </button>
            </div>
            
                    
                
                  <WeatherTabs
                    activeTab={activeInnerTab}
                    onTabChange={setActiveInnerTab}
                  />
      
                  <div className="mt-4">
                    {activeInnerTab === 'day view' && (
                      <WeatherDisplay 
                        weatherData={weatherData}
                        onDateClick={(date) => {
                          setSelectedDate(date);
                          setShowDetails(true);
                        }}
                        
                      />
                    )}
      
                    {activeInnerTab === 'temp chart' && (
                      <TemperatureChart weatherData={weatherData} />
                    )}
      
                    {activeInnerTab === 'meteogram' && (
                      <MeteogramChartComponent weatherData={weatherData} />
                    )}
                  </div>
                  </>
          ) : null}
        </div>
        <div className={`page-content details-page ${showDetails ? 'enter' : ''}`}>
        {showDetails ? (
          <DisplayDetails
            weatherData={weatherData}
            selectedDate={selectedDate}
            city={city}
            state={state}
            onBack={() => setShowDetails(false)}
          />
        ) : null}
      </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingBar />;
    }

    if (activeTab === 'results') {
      return renderResultsContent();
    }

    if (activeTab === 'favorites') {
      return (
        <FavoritesList
          favorites={favorites}
          setFavorites={setFavorites}
          onSelectLocation={(city, state) => {
            setCity(city);
            setState(state);
            setActiveTab('results');
            handleSearch();
          }}
          onDelete={async (id: string) => {
            try {
              await deleteFavorite(id);
              setFavorites(prevFavorites => 
                prevFavorites.filter(fav => fav._id !== id)
              );
              if (id === favoriteId) {
                setStarFilled(false);
                setFavoriteId(null);
              }
            } catch (error) {
              console.error('Error deleting favorite:', error);
            }
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="container mt-4 text-center">
      
          <SearchForm
            street={street}
            city={city}
            state={state}
            useCurrentLocation={useCurrentLocation}
            loading={loading}
            location={location}
            onStreetChange={setStreet}
            onCityChange={setCity}
            onStateChange={setState}
            onCurrentLocationChange={() => setUseCurrentLocation(!useCurrentLocation)}
            onSearch={handleSearch}
            onClear={handleClear}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {renderToggleButtons()}
          {renderContent()}
        
    </div>
  );
};

export default App;
