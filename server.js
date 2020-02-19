// Load Environment Variables from the .env file
// require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// node CJS "require" will parse JSON for us into array/object
const geoData = require('./data/geo.json');

// Application Setup
// - make an express app!
const app = express();
// - get the port on which to run the server
// - enable CORS
app.use(cors());

// API Routes
// app.<verb>(<noun>, handler);
app.get('/location', (request, response) => {
    try {
        // use express built-in query object
        const location = request.query.location;
        const result = getLatLng(location);
        response.status(200).json(result);
    }
    catch(err) {
        // TODO: make an object and send via .json...
        response.status(500).send('Sorry something went wrong, please try again');
    }
});

// Helper Functions
function getLatLng(location) {
    // simulate an error if special "bad location" is provided:
    if(location === 'bad location') {
        throw new Error();
    }

    // ignore location for now, return hard-coded file
    // api call will go here

    // convert to desired data format:
    return toLocation(geoData);
}

function toLocation(/*geoData*/) {
    const firstResult = geoData.results[0];
    const geometry = firstResult.geometry;
    
    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

module.exports = {
    app,
    toLocation,
    getLatLng
};




// Create a route with a method of get and a path of /location. The route callback should invoke a function to convert the search query to a latitude and longitude. The function should use the provided JSON data.

// Return an object which contains the necessary information for correct client rendering. See the sample response.

// Confirm that your route is responding as expected by entering your deployed backend URL on the City Explorer app's welcome page. Then search for a location. You should see the map, but not any other data yet.