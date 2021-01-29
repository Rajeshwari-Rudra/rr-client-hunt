// Resource : http://www.movable-type.co.uk/scripts/latlong.html?from=48.86,-122.0992&to=48.8599,-122.1449 
// Above link for calculating distance 


import locationsArray from '../init-locations.js';

// for location element we assigned location id.
let locationElement = document.getElementById("location");

window.addEventListener('load', main);
locationElement.addEventListener('click', locationHandler);
locationElement.addEventListener('touch', locationHandler);

function main() {
    console.log('Page is fully loaded');
}

// initializing the current position latitude and longitude and error to true
let currentPositionLatitude;
let currentPositionLongitude;
let error = true;

// collects current location
async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return position;
    });
}

// gets current locations and compares the locations from init-locations.js
// if error is true provides you're not 20 meters nearer to any place
// if error is false won't show any thing
async function locationHandler() {
    let locText = await getLocation();
    currentPositionLatitude = locText.coords.latitude;
    document.getElementById("device-lat").innerHTML = "This is about device-lat: " + currentPositionLatitude.toFixed(6);
    currentPositionLongitude = locText.coords.longitude;
    document.getElementById("device-long").innerHTML = "This is about device-long: " + currentPositionLongitude.toFixed(6);

    locationsArray.forEach(function (value) {
        if (isInside(value.Latitude, value.Longitude)) {
            document.getElementById("locationAnswer").innerHTML = value.Name;
            let utterance = new SpeechSynthesisUtterance("You reached the quest. Welcome to " + value.Name);
            speechSynthesis.speak(utterance);
            error = false;
        }
    });

    if(error) {
        let innerHTML = "You're not 20 meters nearer to any place.";
        document.getElementById("error-message").innerHTML = innerHTML;
        let utterance = new SpeechSynthesisUtterance(innerHTML);
        speechSynthesis.speak(utterance);
    } else {
        document.getElementById("error-message").innerHTML = "";
    }
}

//Calculates distance and checks distance is below or above 20 meters
function isInside(questLatitde, questLongitude) {
    let distance = distanceBetweenLocations(questLatitde, questLongitude);
    console.log("distance: " + distance);
    if (distance < 20) {
        return true;
    } else {
        return false;
    }
}


//Calculate distance between Latitude/Longitude points
//Returns the  calculated distance in meters
function distanceBetweenLocations(questLatitde, questLongitude) {
    const R = 6371e3;
    const φ1 = currentPositionLatitude * Math.PI / 180;
    const φ2 = questLatitde * Math.PI / 180;
    const Δφ = (questLatitde - currentPositionLatitude) * Math.PI / 180;
    const Δλ = (questLongitude - currentPositionLongitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d; // in metres
}


