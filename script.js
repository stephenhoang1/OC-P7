var map, infoWindow;
var markersArray = [];
var newRestData = [];
var tempRestArray = [];

// create map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 14,
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(currentLocation);
        infoWindow.setContent('You are here');
        infoWindow.open(map);

        var locationCenter = map.getCenter();
        map.setCenter(locationCenter);

        // START REVERSE GEOCODE TO GET THE CITY AND COUNTRY
