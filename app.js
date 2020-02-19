const express = require('express');
const data = require('./geo.js');
const weather = require('./darksky.js');
const cors = require('cors');
const app = express();
// const request = require('superagent');

// need cors cause of magic
app.use(cors());
// localhost:9000/ returns 'Hello World!'
// request not using yet
// respond with respond.send
app.get('/', (request, respond) => respond.send('Hello World!'));

// initialize the global state of lat and lng so it's accessible in other routes
let lat;
let lng;

// localhost:9000/location (the data/cityData) returns
// request using /location
// setting cityData to data.results 0 index from our data js file
app.get('/location', (request, respond) => {
    const location = request.query.search;

    const cityData = data.results[0];

    // update the global state of lat and lng so it's accessible in other routes
    lat = cityData.geometry.location.lat;
    lng = cityData.geometry.location.lng;

    //respond with the data from js file 
    respond.json({
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng,
    });
});

const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    })
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
