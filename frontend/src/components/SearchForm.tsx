import React, { useState, useRef, useEffect } from "react";
import { Location } from "../types/weathertypes";
import { useJsApiLoader, Libraries } from '@react-google-maps/api';


const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  interface SearchFormProps {
    street: string;
    city: string;
    state: string;
    useCurrentLocation: boolean;
    loading: boolean;
    location: Location | null;
    onStreetChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onStateChange: (value: string) => void;
    onCurrentLocationChange: () => void;
    onSearch: () => void;
    onClear: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }

  const libraries: Libraries = ['places'];
  const SearchForm: React.FC<SearchFormProps> = ({
    street, city, state, useCurrentLocation, loading,
    onStreetChange, onCityChange, onStateChange,
    onCurrentLocationChange, onSearch, onClear, location
  }) => {
    

    const [touched, setTouched] = useState({
      street: false,
      city: false,
      state: false
    });
  
    const inputRef = useRef<HTMLInputElement>(null);

  // Load Google API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_AUTOCOMPLETE_API_KEY || '', // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
          const cityName = place.address_components[0]?.long_name || '';
          onCityChange(cityName);
        }
      });
    }
  }, [isLoaded, onCityChange]);

    const handleBlur = (field: keyof typeof touched) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

    const isFormValid = () => {
      if (useCurrentLocation) {
        return location !== null;
      }
      return street.trim() !== '' && city.trim() !== '' && state.trim() !== '';
    };

    return (
      <div className="container text-center mt-0" id="search-container">
        <div className="text-center">
          <h3 className="heading">Weather Search ⛅</h3>
        <form>
          <div className="form-group row">
            <label className="col-sm-4 col-10 text-sm-center text-start form-label">Street<span className="text-danger">*</span></label>
            <div className="col-sm-6">
              <input
                type="text"
                className={`form-control ${touched.street && !street.trim() ? 'is-invalid' : ''}`}
                value={street}
                onChange={e => onStreetChange(e.target.value)}
                onBlur={() => handleBlur('street')}
                disabled={useCurrentLocation}
              />
              {touched.street && !street.trim() && (
                <div className="invalid-feedback text-start">
                  Please enter a valid street
                </div>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-10 text-sm-center text-start form-label">City<span className="text-danger">*</span></label>
            <div className="col-sm-6">
              <input
                ref={inputRef}
                type="text"
                className={`form-control ${touched.city && !city.trim() ? 'is-invalid' : ''}`}
                value={city}
                placeholder=""
                onChange={e => onCityChange(e.target.value)}
                onBlur={() => handleBlur('city')}
                disabled={useCurrentLocation}
              />
              {touched.city && !city.trim() && (
                <div className="invalid-feedback text-start">
                  Please enter a valid city
                </div>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-10 text-sm-center text-start form-label">State<span className="text-danger">*</span></label>
            <div className="position-relative col-sm-2">
              <select
                className={`form-select ${touched.state && !state ? 'is-invalid' : ''}`}
                value={state}
                onChange={e => onStateChange(e.target.value)}
                onBlur={() => handleBlur('state')}
                disabled={useCurrentLocation}
              >
                <option value="">Select a state...</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {touched.state && !state && (
                <div className="invalid-feedback text-start">
                  
                </div>
              )}
              
            </div>
          </div>
          <hr></hr>
          <div className="form-group row">
          <label className="col-sm-12 col-form-label">
            Autodetect Location<span className="text-danger me-2">*</span> <input
              type="checkbox"
              className="form-check-input"
              id="currentLocation"
              checked={useCurrentLocation}
              onChange={onCurrentLocationChange}
            /> Current Location
          </label>
            
  
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={onSearch}
              disabled={!isFormValid()}
            >
              <i className="bi bi-search"></i>
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              id="clearbutton"
              onClick={() => {
                onClear();
                setTouched({ street: false, city: false, state: false });
              }}
            >
              <i className="bi bi-list-nested"></i>
              Clear
            </button>
            </div>
          </div>
        </form>
        </div>
        </div>
      );
    };
    
    export default SearchForm;