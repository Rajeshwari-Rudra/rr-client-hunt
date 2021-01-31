
import locationsArray from '../init-locations.js';

// for location element location id was assigned.
let locationElement = document.getElementById("location");

window.addEventListener('load', main);
locationElement.addEventListener('click', locationHandler);
locationElement.addEventListener('touch', locationHandler);

function main() {
    console.log('Page is fully loaded');
}

// initializing the variables current position latitude and longitude and error to true
let currentPositionLatitude;
let currentPositionLongitude;
let error = true;

// getter method for tracing the current location
async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return position;
    });
}

// gets current locations and compares with the other locations from init-locations.js
// if error is true it says as you're not in 20 meters range of any destination
// if error is false doesn't show any thing
async function locationHandler() {
    let locText = await getLocation();
    currentPositionLatitude = locText.coords.latitude;
    document.getElementById("device-lat").innerHTML = "This is about device-lat: " + currentPositionLatitude.toFixed(6);
    currentPositionLongitude = locText.coords.longitude;
    document.getElementById("device-long").innerHTML = "This is about device-long: " + currentPositionLongitude.toFixed(6);

    locationsArray.forEach(function (value) {
        if (isInside(value.Latitude, value.Longitude)) {
            document.getElementById("locationAnswer").innerHTML = value.Name;
            let utterance = new SpeechSynthesisUtterance("Hey...! You have reached the destination Welcome to " + value.Name);
            speechSynthesis.speak(utterance);
            error = false;
        }
    });

    if(error) {
        let innerHTML = "You're not in 20 meters range of any destination.";
        document.getElementById("error-message").innerHTML = innerHTML;
        let utterance = new SpeechSynthesisUtterance(innerHTML);
        speechSynthesis.speak(utterance);
    } else {
        document.getElementById("error-message").innerHTML = "";
    }
}

//Calculates distance and checks weather the distance is below or above 20 meters
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


