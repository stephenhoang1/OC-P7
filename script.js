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
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: currentLocation }, function (
          results,
          status
        ) {
          if (status === 'OK') {
            var city = document.getElementById('city');
            var country = document.getElementById('country');

            city.innerHTML = results[0].address_components[3].long_name;
            country.innerHTML = results[0].address_components[5].long_name;
          } else {
            window.alert('No results found');
          }
        });

        // START OF GOOGLE PLACES API LOAD
        var mapCenter = map.getCenter();

        // nearby search
        var request = {
          location: mapCenter,
          radius: '1000',
          type: ['restaurant'],
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // for each returned place using nearby search request...
            for (var x in results) {
              // make a places request to return these fields
              var placesRequest = {
                placeId: results[x].place_id,
                fields: [
                  'name',
                  'photo',
                  'vicinity',
                  'rating',
                  'geometry',
                  'review',
                  'price_level',
                  'place_id',
                ],
              };

              service.getDetails(placesRequest, callback);

              function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  // populate reviews array with review results
                  function genReviews() {
                    for (var x = 0; x < place.reviews.length; x++) {
                      var review = {
                        user_photo: place.reviews[x].profile_photo_url,
                        stars: place.reviews[x].rating,
                        comment: place.reviews[x].text,
                      };
                      newRestaurant.ratings.push(review);
                    }
                  }

                  // create new restaurant and add it to the global restaurants array
                  var newRestaurant = {
                    id: place.place_id,
                    restaurantName: place.name,
                    image:
                      'https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto,w_300,h_216,c_fit,fl_strip_profile/https://s3.amazonaws.com/pixtruder/original_images/256bcd631df0a49d24b03a30cad403298c93f6f0',
                    address: place.vicinity,
                    cusine: 'Vietnamese', //Placeholders
                    priceRange: '$', //Placeholders
                    lat: place.geometry.location
