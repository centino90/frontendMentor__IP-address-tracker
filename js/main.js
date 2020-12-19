
//initiate map
 const icon = L.icon({
    iconUrl: '../../images/icon-location.svg',
    iconSize: [42, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
var map = L.map('map')

map.setView([14.65889, 121.07361], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false
}).addTo(map);

var layerGroup = L.layerGroup().addTo(map)
var marker = L.marker([14.65889, 121.07361], { icon: icon }).addTo(map)
marker.bindPopup('Diliman').openPopup();

// api
const Api = {
    base: 'https://geo.ipify.org/api/v1',
    key: 'at_0JtckhgzSATj38O3IWu8amPcUfYYL'
}

const output = document.querySelector('.form__output');
const address = document.getElementById('ip');
const btn = document.getElementById('button');
const loader = document.getElementById('loader');
const burger = document.querySelector('.burger-menu');
burger.addEventListener('click', () => {
    document.querySelector('html').classList.toggle('toggled-menu')
})
btn.addEventListener('click', () => fetchApi(address.value));

function fetchApi(query) {
    if (query == '' || query == undefined) {
        console.log('empty or undefined')
        return
    }

    loader.style.display = "block";
    fetch(`${Api.base}?apiKey=${Api.key}&ipAddress=${query}`)
        .then(data => {
            loader.style.display = "none";
            return data.ok ? data.json() : data === null;
        })
        .then(displayResult)
}

function displayResult(obj) {
    if (!obj || obj.location.country === undefined) {
        console.error('Custom error: ip address not found')
        removeContent()
        return
    }

    let newObj = {
        ip: obj.ip,
        country: obj.location.country,
        city: obj.location.city,
        timezone: obj.location.timezone,
        isp: obj.isp,
        lat: obj.location.lat,
        lng: obj.location.lng
    }

    //variables
    const ip = document.getElementById('ipadd')
    const location = document.getElementById('location')
    const timezone = document.getElementById('timezone')
    const isp = document.getElementById('isp')

    ip.textContent = newObj.ip;
    location.textContent = `${newObj.city} ${newObj.country}`
    timezone.textContent = newObj.timezone
    isp.textContent = newObj.isp
    console.log(newObj.lat, newObj.lng)
    resetMap(newObj.lat, newObj.lng, newObj.city)
}

function removeContent() {
    //variables
    const ip = document.getElementById('ipadd')
    const location = document.getElementById('location')
    const timezone = document.getElementById('timezone')
    const isp = document.getElementById('isp')

    ip.textContent = 'Not found'
    location.textContent = 'Not found'
    timezone.textContent = 'Not found'
    isp.textContent = 'Not found'
    address.value = ''
}

function resetMap(lat, lng, city) {
    // reset map
    layerGroup.clearLayers()
    map.closePopup()
    marker = L.marker(([lat, lng]),{ icon: icon }).addTo(layerGroup)
    marker.bindPopup(`${city}`).openPopup()
    map.flyTo([lat,lng]).addTo(map)

}

// function panMap(lat, lng, city) {
//     const map2 = L.map('map')
//     map2.panTo([lat, lng, city]);
// }

