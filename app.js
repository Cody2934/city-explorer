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
app.get('/events', async(req, res, next) => {
    try {
        const events = await request.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENT_API_KEY}&where=${lat},${lng}&within=25&page_size=20&page_number=1`);
        // using .text from the data. changing text data from xml to json
        const event = JSON.parse(events.text);
        // map through all events and grab only what I want
        const eventfulStuff = event.events.event.map(event => {
            return {
                link: event.url,
                name: event.title,
                event_date: event.start_time,
                summary: event.description,
            };
        });
            //respond with JSON object containing data I want.
        res.json(eventfulStuff);
    } catch (err) {
        next(err);
    }
});

// YELP
app.get('/reviews', async(req, res, next) => {
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
        next(err);
    }
});

// TRAILS
app.get('/hiking', async(req, res, next) => {
    try {
        const trail = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=10&key=${process.env.HIKING_API_KEY}`)
        const hikingStuff = trail.body.trails.map(trail => {
            return {
                name: trail.name,
                location: trail.length,
                length: trail.length,
                stars: trail.stars,
                star_votes: trail.starVotes,
                summary: trail.summary,
                trail_url: trail.url,
                conditions: trail.conditionStatus,
                condition_date: trail.conditionDate.substring(0, 10),
                condition_time: trail.conditionDate.substring(10),
            };
        });
        res.json(hikingStuff);
    } catch (err) {
        next(err);
    }
});

// if no result 404
app.get('*', (req, res) => res.json('404!!!'));

module.exports = {
    app: app,
};
