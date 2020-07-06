const geonamesApi = require( "../variables/geonames.json");
const pixabayApi = require( "../variables/pixabay.json");
const weatherbitApi = require( "../variables/weatherbit.json");

const FORECAST = {
    "CURRENT": "current",
    "FUTURE": "future"
};

// DOM interaction
function getTripCity() {
    return document.getElementById('city').value;
}

function getTripStartDate() {
    const dateString = document.getElementById('departure-date').value.split('-');
    return dateString.join('/');
}

function getCountdown (tripStartDate) {
    const currentDate = new Date();
    const startDate = new Date(tripStartDate);
    const diffTime = Math.abs(startDate - currentDate);
    const diffInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffInDays;
  }

// API Calls
async function fetchLocation(city) {
    const endpointUrl = `${geonamesApi.baseUrl}&q=${city}&username=${geonamesApi.username}&style=${geonamesApi.style}`;
    try {
        const apiResponse = await fetch(endpointUrl);

        // return if no response
        if (!apiResponse.ok) {
            return null;
        }

        const location = {};
        const responseBody = await apiResponse.json();
        location.latitude = responseBody.geonames[0].lat;
        location.longitude = responseBody.geonames[0].lng;
        location.countryName = responseBody.geonames[0].countryName;

        console.log(location);
        return location;
    }
    catch (error) {
        console.log("Error while fetching location: " + error);
    };
}

async function fetchWeatherForecast(latitude, longitude, forecast = FORECAST.CURRENT) {
    const baseUrl = (forecast === FORECAST.CURRENT) ? `${weatherbitApi.current.baseUrl}` : `${weatherbitApi.future.baseUrl}`;
    const endpointUrl = `${baseUrl}&units=I&lat=${latitude}&lon=${longitude}&key=${weatherbitApi.key}`;
    try {
        const apiResponse = await fetch(endpointUrl);

        // return if no response
        if (!apiResponse.ok) {
            return null;
        }

        const forecast = {};
        const responseBody = await apiResponse.json();

        forecast.temperature = responseBody.data[0].temp;
        forecast.weather = responseBody.data[0].weather;
        forecast.uvIndex = responseBody.data[0].uv;
        forecast.sunrise = responseBody.data[0].sunrise;
        forecast.sunset = responseBody.data[0].sunset;

        return forecast;
    }
    catch (error) {
        console.log("Error while fetching forecast: " + error);
    };
}

async function fetchPhoto(city, country) {
    const endpointUrl = `${pixabayApi.baseUrl}&q=${city}&key=${pixabayApi.apiKey}&image_type=${pixabayApi.image_type}`;
    try {

        const apiResponse = await fetch(endpointUrl);

        // return if no response
        if (!apiResponse.ok) {
            return null;
        }

        const responseBody = await apiResponse.json();
        // return if city images are found
        if (responseBody.hits !== 0) {
            return responseBody.hits[0].largeImageURL;
        }
        endpointUrl = `${pixabayApi.baseUrl}&q=${country}&key=${pixabayApi.apiKey}&image_type=${pixabayApi.image_type}`;
        const countryImageResponse = await fetch(endpointUrl);
        if(!countryImageResponse.ok) {
            return null;
        }
        const countryImageResponseBody = await countryImageResponse.json();
        return countryImageResponseBody.hits[0].largeImageURL;

    }
    catch (error) {
        console.log("Error while fetching photo: " + error);
    };
}

export {
    getTripCity,
    getTripStartDate,
    fetchLocation,
    fetchWeatherForecast,
    fetchPhoto,
    getCountdown,
    FORECAST
}
