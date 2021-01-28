// import default object with a local camelCase name
import locationsArray from '../init-locations.js';

const inside = (device, bounds) => {
  // console.log(`CHECKING inside ${bounds.Name}`);
  // console.log(device);
  // console.log(bounds);
  // console.log(device.latitude > bounds.South);
  // console.log(device.latitude < bounds.North);
  // console.log(device.longitude > bounds.West);
  // console.log(device.longitude < bounds.East);
  const ans =
    device.latitude > bounds.South &&
    device.latitude < bounds.North &&
    device.longitude > bounds.West &&     
    device.longitude < bounds.East;
  // console.log(`CHECKING ${bounds.Name} ANS: ${ans}`);
  return ans;
};

export default function getLocation() {
  if (!navigator.geolocation) {
    document.querySelector('#error-message').innerHTML =
      'Browser does not support geolocation.';
  } else {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        document.querySelector('#device-lat').innerHTML = '';
        document.querySelector('#device-long').innerHTML = '';
        document.querySelector('#locationAnswer').innerHTML = '';

        if (position === undefined) {
          document.querySelector('#error-message').innerHTML =
            'Browser cannot determine device position (position is undefined).';
        }
        const device = position.coords;
        document.querySelector('#device-lat').innerHTML = device.latitude;
        document.querySelector('#device-long').innerHTML = device.longitude;
        const arrayLength = locationsArray.length;
        for (let i = 0; i < arrayLength; i += 1) {
          const thisLoc = locationsArray[i];
          if (inside(device, thisLoc)) {
            const name = thisLoc.Name;
            document.querySelector('#locationAnswer').innerHTML = name;
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = `Congratulations! You found location ${name}`;
            window.speechSynthesis.speak(utterance);
            break;
          }
        }
      },
      (err) => {
        const s = `ERROR(${err.code}): ${err.message}`;
        console.warn(s);
        document.querySelector('#error-message').innerHTML = err.message;
      },
      options,
    );
  }
}