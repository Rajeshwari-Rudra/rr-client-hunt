// first imports.......................
import locationsArray from '../init-locations.js';

// helper functions....................


// event handlers......................


let locationElement = document.getElementById("location");

window.addEventListener('load', main);
locationElement.addEventListener('click', locationHandler);
locationElement.addEventListener('touch', locationHandler);

function main() {
    console.log('Page is fully loaded');
}

let currentlat;
let currentlon;
let error = true;

// getLocation() function is used to collect the current location
async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return position;
    });
}

//the locationHandler() function checksout the current location and compares it with the 
//init-locations.

async function locationHandler() {
    let locText = await getLocation();
    currentlat = locText.coords.latitude;
    document.getElementById("device-lat").innerHTML = "Your device-latitude: " + currentlat.toFixed(6);
    currentlon = locText.coords.longitude;
    document.getElementById("device-long").innerHTML = "Your device longitude: " + currentlon.toFixed(6);

    locationsArray.forEach(function (value) {
        if (isInside(value.Latitude, value.Longitude)) {
            document.getElementById("locationAnswer").innerHTML = value.Name;
            error = false;
        }
    });

    // In case of any error where if the device is not 30m range it displays error.

    if(error) {
        document.getElementById("error-message").innerHTML = "You're not in the radius range.";
    } else {
        document.getElementById("error-message").innerHTML = "";
    }
}


//checking if distance is in 30m range.


function isInside(questLat, questLon) {
    let distance = distanceBetweenLocations(questLat, questLon);
    console.log("distance: " + distance);
    if (distance < 30) {
        return true;
    } else {
        return false;
    }
}

//distance between the lat-long points.
function distanceBetweenLocations(questLat, questLon) {
    const R = 6371e3;
    const φ1 = currentlat * Math.PI / 180;
    const φ2 = questLat * Math.PI / 180;
    const Δφ = (questLat - currentlat) * Math.PI / 180;
    const Δλ = (questLon - currentlon) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d; 
}