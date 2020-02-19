const express = require('express');
const data = require('./geo.js');
// const ?something? = require('./darksky.json');
const app = express();
// const request = require('superagent');

// localhost:9000/ returns 'Hello World!'
// request not using yet
// respond with respond.send
app.get('/', (request, respond) => respond.send('Hello World!'));

// localhost:9000/location (the data/cityData) returns
//request using /location
// setting cityData to data.results 0 index from our data js file
app.get('/location', (request, respond) => {
    const cityData = data.results[0];

    //respond with the data from js file 
    respond.json({
        // ??????????????????
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng,
    });
});


// app.get('/weather', (request, respond) => {
//     const weatherData = ?something?.results[0];
// })

// if no result 404
app.get('*', (req, res) => res.json('404!!!'));

// using port/localhost 9000
const port = process.envPORT || 9000;

app.listen(port, () => console.log (`Example app listening on port ${port}`));

