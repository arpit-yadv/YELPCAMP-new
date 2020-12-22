
let coordinates1 = coordinates.split(',');
console.log(coordinates)
// let campground1 = JSON.parse(campground);
// console.log(campground1)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center:coordinates1, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker()
.setLngLat(coordinates1)
.addTo(map);


const popup = new mapboxgl.Popup({ closeOnClick: false })
.setLngLat(coordinates1)
.setHTML('<h3>Trek!</h3>')
.addTo(map);

map.addControl(new mapboxgl.NavigationControl());