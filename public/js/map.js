document.addEventListener('DOMContentLoaded', (event) => {
    const maps = L.map('map').setView([51.505, -0.09], 13);
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(maps);
});
var Singlemarker=L.marker([20.3533,85.8266]);
var popup=Singlemarker.bindPopup("this is patia").openPopup()
popup.addTo(map);