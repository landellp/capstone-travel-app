import {
  getTripCity,
  getTripStartDate,
  fetchLocation,
  fetchWeatherForecast,
  fetchPhoto,
  getCountdown,
  FORECAST
} from "./travel";

// global variables
const tripInfo = {};
let savedTrips = [];

const createListItem = (trip, idx) => {
  const listItem = document.createElement("li");
  listItem.setAttribute("class", "card-content");
  const spanNode = document.createElement("span");
  const imgElement = document.createElement("img");
  imgElement.setAttribute("id", idx);
  imgElement.setAttribute("src", trip.photoUrl);
  imgElement.setAttribute("alt", "trip city photo");
  spanNode.appendChild(imgElement);
  const divNode = document.createElement("div");
  const tripHeading = document.createElement("h3");
  tripHeading.setAttribute("id", "trip-city");
  tripHeading.innerHTML = `${trip.city}`;
  const tripWeather = document.createElement("p");
  tripWeather.setAttribute("id", "weather");
  tripWeather.innerHTML = `Current Temp: ${trip.weatherForecast.temperature}&deg; F<br>Current Sky Condition: ${trip.weatherForecast.weather.description}`;
  const tripCountdown = document.createElement("p");
  tripCountdown.setAttribute("id", "trip-countdown");
  tripCountdown.innerHTML = `Your trip is ${trip.countdown} days away`;
  divNode.appendChild(tripHeading);
  divNode.appendChild(tripWeather);
  divNode.appendChild(tripCountdown);
  listItem.appendChild(spanNode);
  listItem.appendChild(divNode);
  return listItem;
};

const renderLastAddedElement = (trip, idx) => {
  const li = createListItem(trip, idx);
  return li;
};

const renderAllElements = (trips) => {
  return trips.map((trip, idx) => {
    return createListItem(trip, idx);
  });
};

function updateUI(savedTrips) {
  if (!savedTrips) {
    alert("Could not find any saved trips. Try again later!");
    return;
  }
  const length = savedTrips.length;
  if (length == 0) {
    emptyMessage.style.visibility = 'block';
  }

  const emptyMessage = document.getElementById("empty-message");
  let tripsNode = document.getElementById("trips");

  if (tripsNode.childElementCount > 0) {
    const listItem = renderLastAddedElement(savedTrips[length - 1], length - 1);
    tripsNode.appendChild(listItem);
  } else {
    const tripCards = renderAllElements(savedTrips);

    // add cards to the trip node section
    tripCards.forEach((card) => {
      tripsNode.appendChild(card);
    });
  }

  // hide the empty message
  emptyMessage.style.visibility = 'hidden';
}

function updateSearchView(tripInfo) {
  const tripCityElement = document.getElementById("trip-city");
  tripCityElement.innerHTML = tripInfo.city;
  const weatherElement = document.getElementById("weather");
  weatherElement.innerHTML = `${tripInfo.weatherForecast.temperature}&deg; F`;
  const tripCountdownElement = document.getElementById("trip-countdown");
  tripCountdownElement.innerHTML = `Your trip is ${tripInfo.countdown} days away`;
  const tripImageElement = document.getElementById("trip-image");
  tripImageElement.setAttribute("src", tripInfo.photoUrl);
  document.getElementById("search-result").classList.remove("display-result");
}

function removeSearchResult() {
  // removes data from fields
  document.getElementById("trip-image").setAttribute("src", "#");
  document.getElementById("trip-city").innerHTML = "";
  document.getElementById("weather").innerHTML = "";
  document.getElementById("trip-countdown").innerHTML = "";
  document.getElementById("search-result").classList.add("display-result");
}

async function handleSubmit(event) {
  event.preventDefault();
  tripInfo.city = getTripCity();
  tripInfo.startDate = getTripStartDate();

  if (!tripInfo.city || !tripInfo.startDate) {
    alert("City and Start Date are required!");
    return;
  }


  tripInfo.countdown = getCountdown(tripInfo.startDate);

  // fetch from geonames
  tripInfo.location = await fetchLocation(tripInfo.city);

  if (tripInfo.location === null) {
    alert("Error fetching location details... Try again later!");
    return;
  }

  // fetch from Weatherbit
  tripInfo.weatherForecast = await fetchWeatherForecast(
    tripInfo.location.latitude,
    tripInfo.location.longitude
  );

  // fetch the location photo from pixabay
  tripInfo.photoUrl = await fetchPhoto(
    tripInfo.city
  );

  console.log(tripInfo);
  updateSearchView(tripInfo);
}

// Save trip information
async function handleSave(event) {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:8081/trip/save", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ trip: tripInfo }),
    });

    if (!response.ok) {
      return null;
    }

    savedTrips = await response.json();

    removeSearchResult();
    updateUI(savedTrips);

    console.log(savedTrips);
    return savedTrips;
  } catch (error) {
    console.log(error);
  }
}

async function fetchTrips() {
  try {
    const response = await fetch("http://localhost:8081/trips", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    savedTrips = await response.json();
    console.log(savedTrips);
    updateUI(savedTrips);
  } catch (error) {
    console.log(error);
  }
}

export { handleSubmit, handleSave, fetchTrips };
