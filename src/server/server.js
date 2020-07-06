const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'))

app.listen(8081, function () {
    console.log('Server Running on localhost:8081')
})

let trips = [];

app.get('/', function (request, response) {
    response.sendFile(path.resolve('/dist/index.html'));
});

app.get('/trips', (request, response) => {
    response.status(200).send(trips);
});

app.post('/trip/save', (request, response) => {
    const reqBody = request.body;
    console.log(reqBody.trip);
    if (!reqBody || !reqBody.trip) {
        return status(400).send("Invalid Request");
    }
    trips.push(reqBody.trip);
    response.status(200).send(trips);
});
