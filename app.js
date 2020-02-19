require('dotenv').config();
const express = require('express');
const weather = require('./darksky.js');
const request = require('superagent');
const cors = require('cors');
const app = express();

// need cors cause of magic
app.use(cors());

// localhost:9000/ returns 'Hello World!'
// request uses superagent
// respond with respond.send
app.get('/', (request, respond) => respond.send('Hello World!'));

// initialize the global state of lat and lng so it's accessible in other routes
let lat;
let lng;

// localhost:9000/location (the data/cityData) returns
// request using /location
// setting cityData to data.results 0 index from our data js file
app.get('/location', async(req, respond, next) => {
    try {

        const location = req.query.search;

        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        
        const cityData = await request.get(URL);

        const firstResult = cityData.body[0];

        // update the global state of lat and lng so it's accessible in other routes
        lat = firstResult.lat;
        lng = firstResult.lon;

        //respond with the data from js file 
        respond.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lng,
        });
    } catch (err) {
        next(err);
    }
});

const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};

// localhost:9000/weather
app.get('/weather', (req, res) => {
    const portlandWeather = getWeatherData(lat, lng);

    res.json(portlandWeather);
});

// if no result 404
app.get('*', (req, res) => res.json('404!!!'));

module.exports = {
    app: app,
};
