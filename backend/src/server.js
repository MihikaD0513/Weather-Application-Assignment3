const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const Favorite = require('./models/favoriteModel');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error);
    });

app.get('/weather', async(req, res) => {
    const { lat, lng } = req.query;
    try {
        const params = {
            location: `${lat},${lng}`,
            fields: [
                'temperature',
                'temperatureMin',
                'temperatureMax',
                'temperatureApparent',
                'weatherCode',
                'windSpeed',
                'windDirection',
                'humidity',
                'visibility',
                'pressureSurfaceLevel',
                'cloudCover',
                'sunriseTime',
                'sunsetTime',
                'precipitationProbability'
            ].join(','),
            units: 'imperial',
            timesteps: ['1h', '1d'],
            timezone: 'America/Los_Angeles',
            apikey: process.env.TOMORROW_API_KEY
        };

        const response = await axios.get('https://api.tomorrow.io/v4/timelines', { params });
        weatherResponse = response.data;
        weatherResponse['latitude'] = lat;
        weatherResponse['longitude'] = lng;
        return res.json(weatherResponse);
} catch (error) {
    console.error(`Error fetching weather: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
}});

app.get('/location', async(req, res) => {
    const {address} = req.query;
    try {
        const params = {
            address: address,
            key: process.env.GOOGLE_GEOCODE_API_KEY
        };

        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params });
        if (!response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: 'No results found for the provided address.' });
          }

        const { lat, lng } = response.data.results[0].geometry.location;
        
        return res.json({lat, lng});
    } catch (error) {
        console.error(`Error fetching weather: ${error}`);
        res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
})

app.get('/favorites', async(req, res) => {
    try {
        const favorites = await Favorite.find().sort({ createdAt: -1 });
        return res.json(favorites);
    } catch (error) {
        throw new Error(`Error fetching favorites: ${error}`);
    }
});

app.post('/check-favorite', async (req, res) => {
    const { city, state } = req.body;
    try {
        const existingFavorite = await Favorite.findOne({ city, state });
        if (existingFavorite) {
            return res.json({
                isFavorite: true,
                favoriteId: existingFavorite._id
            });
        }
        return res.json({
            isFavorite: false,
            favoriteId: null
        });
    } catch (error) {
        return res.status(500).json({ message: `Error checking favorite status: ${error.message}` });
    }
});


app.post('/favorites', async(req, res) => {
    const { city, state } = req.body;
    try {
        const favorite = new Favorite({ city, state });
        await favorite.save();
        return res.json(favorite);
    } catch (error) {
        throw new Error(`Error adding favorite: ${error}`);
    }
});

app.delete('/favorites/:id', async(req, res) => {   
    const { id } = req.params;
    try {
        await Favorite.findByIdAndDelete(id);
        return res.json({ message: 'Favorite deleted' });
    } catch (error) {
        throw new Error(`Error deleting favorite: ${error}`);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });