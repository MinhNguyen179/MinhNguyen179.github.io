import {loadScript} from "./loadScript.js";

const plugin = ({ box, widgets }) => {
    widgets.register("Map", (box) => {
        loadScript(box.window, `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3LEcjTvyxYu1urM8qrGtZc_a5eNlPdW0`)
            .then(() => {
                const rectangleCoordinates = [
                    {
                        "lat": 45.179358,
                        "lng": -91.144138
                    },
                    {
                        "lat": 45.173968,
                        "lng": -91.138852
                    },
                ]

                const container = document.createElement("div")
                container.setAttribute("style", `display:flex; height: 100%; width: 100%;`)
                box.injectNode(container)

                const rectCenter = new box.window.google.maps.LatLngBounds(rectangleCoordinates[0], rectangleCoordinates[1]).getCenter()

                const map = new box.window.google.maps.Map(container, {
                    zoom: 6.3,
                    center: rectCenter,
                    mapTypeId: 'terrain'
                });

                new box.window.google.maps.Rectangle({
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    fillColor: '#0000FF',
                    fillOpacity: 0.05,
                    map,
                    bounds: {
                        north: rectangleCoordinates[1].lat,
                        south: rectangleCoordinates[0].lat,
                        east: rectangleCoordinates[1].lng,
                        west: rectangleCoordinates[0].lng,
                    },
                });

                // Create an object to store the markers by truckId
                const vehicleMarkers = {}

                // Fetch vehicle coordinates and add markers to map
                // fetch('https://fleetsim.onrender.com/vehicle/all/coordinates')
                fetch('https://minhnguyen179.github.io/car_ls.json')
                .then(response => response.json())
                .then(vehicleCoordinates => {
                    // For each vehicle, create a marker on the map
                    for (let truckId in vehicleCoordinates) {
                        let coordinates = vehicleCoordinates[truckId];
                        // Store market in markers object
                        vehicleMarkers[truckId] = new box.window.google.maps.Marker({
                            position: { lat: coordinates.latitude, lng: coordinates.longitude },
                            map: map,
                            icon: "https://maps.google.com/mapfiles/ms/icons/truck.png",
                            clickable: true
                        });
                        vehicleMarkers[truckId].addListener('click', () => {
                            window.location.href = `/model/kuAlpF1nRy65u3dzl9YQ/library/prototype/Aj66iZqab1YIw5dHaaGr/view/run?truckId=${truckId}`
                        })
                    }
                });

                // Every 5 seconds, fetch the new coordinates and update the vehicle markers
                setInterval(async () => {
                    const response = await fetch('https://minhnguyen179.github.io/car_ls.json')
                    const vehicleCoordinates = await response.json();
                    Object.keys(vehicleCoordinates).forEach(truckId => {
                        const coordinates = vehicleCoordinates[truckId];
                        vehicleMarkers[truckId].setPosition({ lat: coordinates.latitude, lng: coordinates.longitude });
                    })
                }, 5000);

                // Create an object to store the markers by chargestationId
                const chargestationMarkers = {}

                // Fetch chargestation coordinates and add markers to map
                fetch('https://minhnguyen179.github.io/car_ls.json')
                .then(response => response.json())
                .then(chargestationCoordinates => {
                    // For each vehicle, create a marker on the map
                    for (let chargestationId in chargestationCoordinates) {
                        let coordinates = chargestationCoordinates[chargestationId];
                        // Store market in markers object
                        chargestationMarkers[chargestationId] = new box.window.google.maps.Marker({
                            position: { lat: coordinates.latitude, lng: coordinates.longitude },
                            map: map,
                            clickable: true
                        });
                        chargestationMarkers[chargestationId].addListener('click', () => {
                            window.location.href = `/model/JUczdpLduBR24kMeMpyC/library/prototype/TX73uJZmwGVy3a4M3jaY/view/run?chargestationId=${chargestationId}`
                        })
                    }
                });

               // Every 5 seconds, fetch the new coordinates and update the chargestation markers
               setInterval(async () => {
                    const response = await fetch("https://minhnguyen179.github.io/car_ls.json")
                    const chargestationCoordinates = await response.json();
                    Object.keys(chargestationCoordinates).forEach(chargestationId => {
                        const coordinates = chargestationCoordinates[chargestationId];
                        chargestationMarkers[chargestationId].setPosition({ lat: coordinates.latitude, lng: coordinates.longitude });
                    })
                }, 5000);

            })
    })
}

export default plugin
