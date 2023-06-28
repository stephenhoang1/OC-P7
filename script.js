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
    navigator.geolocation.getCurrentPosition(function (position) {
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
    });
  }
} // end of initMap

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var x in results) {
      var placesRequest = {
        placeId: results[x].place_id,
        fields: ['name', 'photo', 'vicinity', 'rating', 'geometry', 'review', 'price_level', 'place_id'],
      };

      service.getDetails(placesRequest, callback);
    }
  }
}

// ...rest of the code

// your star filter
function filterByAvgStars(restaurants, min, max) {
  return restaurants.filter(place => {
    return place.average >= min && place.average <= max;
  });
}

// new cleaner fetch
function getRestaurants() {
  return fetch('restaurants.json').then(response => response.json());
}

function onInit() {
  getRestaurants() // fetch data
    .then(augmentRestaurantsData) // add averages to json data.
    .then(data => (globalRestaurants = data)) // add this data to a new variable.
    .then(createListings); // create restaurant listings from this data.
}

function onAvgStarsChange(min, max) {
  if (!globalRestaurants) {
    // if globalRestaurants is empty.
    return getRestaurants() // fetch data
      .then(augmentRestaurantsData) // add averages to json data.
      .then(data => {
        // add this data to a new variable.
        globalRestaurants = data;
        return data;
      })
      .then(data => filterByAvgStars(data, min, max)) // filter the data
      .then(createListings); // create restaurant listings from this data.
  } else {
    var filtered = filterByAvgStars(globalRestaurants, min, max); // create filtered data
    createListings(filtered); // render new list using this data
  }
}

function filterOnSubmit() {
  var minVal = document.getElementById('min');
  var maxVal = document.getElementById('max');
  onAvgStarsChange(minVal.value, maxVal.value);
}

// handle location errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.'
  );
  infoWindow.open(map);
}

// add marker
function addMarker(latLng, color, listing, listNumber) {
  if (listing !== undefined) {
    let url = 'http://maps.google.com/mapfiles/ms/icons/';
    url += color + '-dot.png';

    let marker = new google.maps.Marker({
      map: map,
      position: latLng,
      icon: {
        url: url,
      },
    });

    // add number
    listNumber = listNumber ? `${listNumber}. ` : '';

    // add markup
    var restInfo = `
      <div class="listing">
        <div class="listing-avatar"><img src="${listing.image}"></div>
        <div class="listing-info infoWindow">
          <div class="listing-title">${listNumber}${listing.restaurantName}</div>
          <div class="listing-address">${listing.address}</div>
        </div>
      </div>
    `;

    // add info to infowindow
    var infowindow = new google.maps.InfoWindow({
      content: restInfo,
    });

    // add mouseover event
    marker.addListener('mouseover', function () {
      infowindow.open(map, marker);
    });

    marker.addListener('mouseout', function () {
      infowindow.close();
    });

    // store the marker object drawn in global array
    markersArray.push(marker);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // ADD REVIEW

  document.getElementById('post-review').onclick = function () {
    var commentData = document.getElementById('comment').value;
    var ratingData;
    var starRatings = document.getElementsByName('star-ratings');

    for (var i = 0; i < starRatings.length; i++) {
      if (starRatings[i].checked) {
        ratingData = starRatings[i].value;
        break;
      }
    }

    var newReview = {
      stars: parseInt(ratingData),
      comment: commentData,
    };

    var restModal = document.getElementById('restModal');
    var restName = restModal.getAttribute('restaurant-name');

    var thisItemIndex;
    for (var i = 0; i < globalRestaurants.length; i++) {
      if (globalRestaurants[i].restaurantName === restName) {
        thisItemIndex = i;
        break;
      }
    }

    globalRestaurants[thisItemIndex].ratings.unshift(newReview);

    createListings(globalRestaurants);
    addModalData(globalRestaurants[thisItemIndex]);
  };

  // ADD RESTAURANT

  document.getElementById('post-restaurant').onclick = function () {
    var nameData = document.getElementById('addName').value;
    var addressData = document.getElementById('addAddress').value;
    var priceRanges = document.getElementsByName('priceRanges');

    for (var y = 0; y < priceRanges.length; y++) {
      if (priceRanges[y].checked) {
        var priceRange = priceRanges[y].value;
        break;
      }
    }

    var currentLat = document
      .getElementById('addRestForm')
      .getAttribute('data-lat');
    var currentLong = document
      .getElementById('addRestForm')
      .getAttribute('data-long');

    var newRestaurant = {
      restaurantName: nameData,
      image:
        'https://media-cdn.tripadvisor.com/media/photo-s/0f/b7/d6/40/handmade-chips.jpg',
      address: addressData,
      cusine: 'placeholder text',
      priceRange: 'placeholder text',
      lat: parseFloat(currentLat),
      long: parseFloat(currentLong),
      ratings: [],
    };

    globalRestaurants.push(newRestaurant);

    $('#addNewRestModal').modal('hide');
    document.getElementById('addRestForm').reset();

    createListings(globalRestaurants);

    var newListing = document.getElementById('restaurants').lastChild;
    newListing.click();
  };
});
