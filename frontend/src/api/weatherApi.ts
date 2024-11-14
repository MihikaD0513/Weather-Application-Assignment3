import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3100', // Backend URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getLocationCoordinates = async (address: string) => {
  try {
    const response = await api.get(`/location?address=${encodeURIComponent(address)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { error: error.response.data.error };
    } else {
      return { error: 'An unknown error occurred' };
    }
  }
  };
  
  export const getWeatherData = async (lat: number, lng: number) => {
    const response = await api.get(`/weather?lat=${lat}&lng=${lng}`);
    return response.data;
  };

  export const checkFavorite = async (city: string, state: string) => {
    const response = await api.post('/check-favorite', { city, state});
    return response.data;
  }

  export const getFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
  };
  
  export const addFavorite = async (city: string, state: string) => {
    const response = await api.post('/favorites', { city, state });
    return response.data;
  };
  
  export const deleteFavorite = async (id: string) => {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  };