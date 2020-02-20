require('dotenv').config();
const express = require('express');
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

//WEATHER
const getWeatherData = async(lat, lng) => {

    const weather = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`);

    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};

//WEATHER
app.get('/weather', async(req, res, next) => {
    try {
        const portlandWeather = await getWeatherData(lat, lng);

        res.json(portlandWeather);
    } catch (err) {
        next(err);
    }
});

//EVENTFUL
const getEventData = async(lat, lng) => {

    const events = await request.get(`EVENT URL`);

    return {
        link: ,
        name: ,
        event_date: ,
        summary: ,
    };
}

// YELP
app.get('/reviews', async (req, res) => {
    try {
        const yelp = await request
            .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lng}`)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
        const yelpStuff = yelp.body.businesses.map(business => {
            return {
                name: business.name,
                image: business.image_url,
                price: business.price,
                rating: business.rating,
                url: business.url,
            };
        });
        res.json(yelpStuff);
    } catch (err) {
        res.status(500).send('Sorry something went wrong, please try again');
    }
});

app.get('/events', async(req, res, next) => {
    try {
        const

        res.json();
    } catch (err) {
        next(err);
    }
});

// if no result 404
app.get('*', (req, res) => res.json('404!!!'));

module.exports = {
    app: app,
};
