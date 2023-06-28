var map, infoWindow;
var markersArray = [];
var newRestData = [];
var tempRestArray = [];
var globalRestaurants;

// Create map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 14
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(currentLocation);
      infoWindow.setContent('You are here');
      infoWindow.open(map);

      var locationCenter = map.getCenter();
      map.setCenter(locationCenter);

      // Reverse geocode to get the city and country
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: currentLocation }, function (results, status) {
        if (status === 'OK') {
          var city = document.getElementById('city');
          var country = document.getElementById('country');
          city.innerHTML = results[0].address_components[3].long_name;
          country.innerHTML = results[0].address_components[5].long_name;
        } else {
          window.alert('No results found');
        }
      });

      // Load nearby restaurants using Google Places API
      var mapCenter = map.getCenter();
      var request = {
        location: mapCenter,
        radius: '1000',
        type: ['restaurant']
      };
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
}
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var x in results) {
            var placesRequest = {
              placeId: results[x].place_id,
              fields: ['name', 'photo', 'vicinity', 'rating', 'geometry', 'reviews', 'price_level', 'place_id']
            };

            service.getDetails(placesRequest, createRestaurantCallback);
          }
        }
      }

      function createRestaurantCallback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var newRestaurant = {
            id: place.place_id,
            restaurantName: place.name,
            image: 'https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto,w_300,h_216,c_fit,fl_strip_profile/https://s3.amazonaws.com/pixtruder/original_images/256bcd631df0a49d24b03a30cad403298c93f6f0',
            address: place.vicinity,
            cusine: 'Vietnamese', // Placeholders
            priceRange: '$', // Placeholders
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng(),
            average: place.rating,
            ratings: []
          };

          // Populate reviews array with review results
          if (place.reviews) {
            for (var i = 0; i < place.reviews.length; i++) {
              var review = {
                user_photo: place.reviews[i].profile_photo_url,
                stars: place.reviews[i].rating,
                comment: place.reviews[i].text
              };
              newRestaurant.ratings.push(review);
            }
          }

          newRestData.push(newRestaurant);

          if (!globalRestaurants.includes(newRestaurant)) {
            globalRestaurants.push(newRestaurant);
          }
        }
      }
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Function to create temporary restaurant array based on map drag
  function makeTempRestArray(restData) {
    tempRestArray = [];
    for (var i = 0; i < restData.length; i++) {
      if (map.getBounds().contains({ lat: restData[i].lat, lng: restData[i].long })) {
        tempRestArray.push(restData[i]);
      }
    }
    createListings(tempRestArray);
  }

  onInit();

  setTimeout(function () {
    makeTempRestArray(globalRestaurants);
  }, 4000);

  google.maps.event.addListener(map, 'idle', function () {
    var mapCenter = map.getCenter();
    infoWindow.setPosition(mapCenter);
    infoWindow.setContent('You are here');

    var request = {
      location: mapCenter,
      radius: '1000',
      type: ['restaurant']
    };

    service.nearbySearch(request, callback);

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var x in results) {
          var placesRequest = {
            placeId: results[x].place_id,
            fields: ['name', 'photo', 'vicinity', 'rating', 'geometry', 'reviews', 'price_level', 'place_id']
          };

          service.getDetails(placesRequest, createRestaurantCallback);
        }
      }
    }
  });

  google.maps.event.addListener(map, 'rightclick', function (event) {
    var addRestForm = document.getElementById('addRestForm');
    addRestForm.setAttribute('data-lat', event.latLng.lat());
    addRestForm.setAttribute('data-long', event.latLng.lng());
    $('#addNewRestModal').modal('show');
  });

  function createListings(restData) {
    document.getElementById('restaurants').innerHTML = '';

    restData.forEach(function (x, i) {
      var index = i + 1;
      addMarker({ lat: x.lat, lng: x.long }, 'red', x, index);

      var listing = document.createElement('div');
      listing.setAttribute('class', 'listing');

      listing.addEventListener('click', function () {
        $('#restModal').modal();
        addModalData(x);
      });

      var listingAvatar = document.createElement('div');
      listingAvatar.setAttribute('class', 'listing-avatar');
      var picture = new Image();

      var listingInfo = document.createElement('div');
      listingInfo.setAttribute('class', 'listing-info');

      var listingTitle = document.createElement('div');
      listingTitle.setAttribute('class', 'listing-title');

      var reviewAverage = document.createElement('div');
      reviewAverage.setAttribute('class', 'review-avg');

      var stars = document.createElement('div');
      stars.setAttribute('class', 'stars');

      var bulletReviews = document.createElement('span');
      bulletReviews.innerHTML = '&bull;';
      bulletReviews.setAttribute('class', 'bullet');

      var numberOfReviews = document.createElement('span');
      numberOfReviews.setAttribute('class', 'number-of-reviews');

      var restInfoWindow = document.createElement('div');
      restInfoWindow.setAttribute('class', 'rest_info_window');

      listingAvatar.append(picture);
      reviewAverage.append(stars, bulletReviews, numberOfReviews);
      listingInfo.append(listingTitle, reviewAverage);
      listing.append(listingAvatar, listingInfo);

      var restaurantsDiv = document.getElementById('restaurants');
      restaurantsDiv.append(listing);

      picture.src = x.image;
      listingTitle.innerHTML = index + '. ' + x.restaurantName;
      numberOfReviews.innerHTML = x.ratings.length + ' reviews';

      function createStars(n, id) {
        for (var x = 0; x < Math.round(n); x++) {
          var actualStars = document.createElement('i');
          actualStars.setAttribute('class', 'fas fa-star');
          id.prepend(actualStars);
        }
      }

      if (x.ratings.length > 0) {
        createStars(x.average, stars);
      }
    });
  }

  function addModalData(restaurant) {
    var modalImage = document.getElementById('m-img');
    var streetViewImg =
      'https://maps.googleapis.com/maps/api/streetview?size=254x254&location=' +
      restaurant.lat +
      ',' +
      restaurant.long +
      '&fov=90&heading=235&pitch=10&key=YOUR_API_KEY';
    modalImage.src = streetViewImg;

    var modalRestName = document.getElementById('m-rest-name');
    modalRestName.innerHTML = restaurant.restaurantName;

    var modalNumberOfReviews = document.getElementById('m-number-of-reviews');
    modalNumberOfReviews.innerHTML = restaurant.ratings.length + ' reviews';

    var starAverage = 0;
    var count = 0;

    for (var y = 0; y < restaurant.ratings.length; y++) {
      count += restaurant.ratings[y].stars;
    }

    starAverage = count / restaurant.ratings.length;

    document.getElementById('m-stars').innerHTML = '';

    for (var x = 0; x < Math.round(starAverage); x++) {
      var modalStarsWrapper = document.getElementById('m-stars');
      var actualStar = document.createElement('i');
      actualStar.setAttribute('class', 'fas fa-star');
      modalStarsWrapper.prepend(actualStar);
    }

    createReview(restaurant.ratings.length, restaurant);
  }

  function createReview(noOfReviews, restaurant) {
    $('#m-reviews-container').empty();

    for (var x = 0; x < noOfReviews; x++) {
      var userReview = document.createElement('div');
      userReview.setAttribute('class', 'row user-review');
      var user = document.createElement('div');
      user.setAttribute('class', 'user col-3 user-photo-container');
      var review = document.createElement('div');
      review.setAttribute('class', 'review col-9');
      var name = document.createElement('div');
      name.setAttribute('class', 'name');
      var starsWrapper = document.createElement('div');
      starsWrapper.setAttribute('class', 'm-stars-wrapper stars');
      var reviewComment = document.createElement('p');
      reviewComment.setAttribute('class', 'review-comment');

      user.append(name);
      userReview.append(user);
      review.append(starsWrapper, reviewComment);
      userReview.append(review);

      var reviewsContainer = document.getElementById('m-reviews-container');
      reviewsContainer.append(userReview);

      user.innerHTML = '<img id="user-photo" src=' + restaurant.ratings[x].user_photo + ' alt="">';
      reviewComment.innerHTML = restaurant.ratings[x].comment;

      for (var y = 0; y < restaurant.ratings[x].stars; y++) {
        var actualStars = document.createElement('i');
        actualStars.setAttribute('class', 'fas fa-star');
        starsWrapper.prepend(actualStars);
      }
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  function addMarker(location, color, restaurant, index) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      label: index.toString(),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: '#fff',
        strokeWeight: 3
      }
    });

    google.maps.event.addListener(marker, 'click', function () {
      $('#restModal').modal();
      addModalData(restaurant);
    });

    markersArray.push(marker);
  }

  function clearMarkers() {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }

  $('#addRestForm').on('submit', function (e) {
    e.preventDefault();

    var restName = document.getElementById('restName').value;
    var cuisine = document.getElementById('cuisine').value;
    var priceRange = document.getElementById('priceRange').value;

    var newRestaurant = {
      id: Date.now(),
      restaurantName: restName,
      image: 'https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto,w_300,h_216,c_fit,fl_strip_profile/https://s3.amazonaws.com/pixtruder/original_images/256bcd631df0a49d24b03a30cad403298c93f6f0',
      address: '123 Main St',
      cuisine: cuisine,
      priceRange: priceRange,
      lat: parseFloat($('#addRestForm').attr('data-lat')),
      long: parseFloat($('#addRestForm').attr('data-long')),
      average: 0,
      ratings: []
    };

    globalRestaurants.push(newRestaurant);

    makeTempRestArray(globalRestaurants);

    $('#addNewRestModal').modal('hide');
  });
}

function onInit() {
  globalRestaurants = [
    {
      id: 1,
      restaurantName: 'Restaurant 1',
      image: 'https://via.placeholder.com/150',
      address: '123 Main St',
      cuisine: 'Italian',
      priceRange: '$$',
      lat: -34.397,
      long: 150.644,
      average: 4.5,
      ratings: [
        {
          user_photo: 'https://via.placeholder.com/50',
          stars: 5,
          comment: 'This place is amazing!'
        },
        {
          user_photo: 'https://via.placeholder.com/50',
          stars: 4,
          comment: 'Great food and atmosphere.'
        }
      ]
    },
    {
      id: 2,
      restaurantName: 'Restaurant 2',
      image: 'https://via.placeholder.com/150',
      address: '456 Elm St',
      cuisine: 'Mexican',
      priceRange: '$',
      lat: -34.405,
      long: 150.656,
      average: 3.8,
      ratings: [
        {
          user_photo: 'https://via.placeholder.com/50',
          stars: 4,
          comment: 'Delicious tacos!'
        },
        {
          user_photo: 'https://via.placeholder.com/50',
          stars: 3,
          comment: 'Good prices, but service can be slow.'
        }
      ]
    }
  ];
}

// Load the Google Maps JavaScript API asynchronously
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
  document.body.appendChild(script);
}

window.onload = loadScript;
</script>

</body>

</html>
