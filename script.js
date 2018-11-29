// Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you
    var map, infoWindow;

let markersArray = [];

// create map
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
      });
      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };


          addMarker({lat: 21.065397006132635, lng: 105.82235818728807}, "red")
          addMarker(pos, "green");

          infoWindow.setPosition(pos);

          infoWindow.setContent('You are here');

          infoWindow.open(map);
          map.setCenter(pos);

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }

// handle location errors
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

// add marker
    function addMarker(latLng, color) {
      let url = "http://maps.google.com/mapfiles/ms/icons/";
      url += color + "-dot.png";

      let marker = new google.maps.Marker({
        map: map,
        position: latLng,
        icon: {
          url: url
        }
      });

      //store the marker object drawn in global array
      markersArray.push(marker);
    }

// mobile toggle buttons
function mobileViewToggle() {
  $('.list-button').on('click', function() {
    $('.map-container').hide()
    $('#restaurants, .header').show()
  })

  $('.map-button').on('click', function() {
    $('#restaurants, .header').hide()
    $('.map-container').show()
  })
}
mobileViewToggle()


  // 1. CREATE

  // make div
  var listing = document.createElement("div")
  listing.setAttribute('class', 'listing')

  // make listing-avatar div
  var listingAvatar = document.createElement("div")
  listingAvatar.setAttribute('class', 'listing-avatar')
  var picture = new Image()

  // make listing-info div
  var listingInfo = document.createElement("div")
  listingInfo.setAttribute('class', 'listing-info')

    // listing-title
    var listingTitle = document.createElement("div")
    listingTitle.setAttribute('class', 'listing-title')

    // reviews
    var reviews = document.createElement("div")
    reviews.setAttribute('class', 'reviews')

      // stars
      var stars = document.createElement("div")
      stars.setAttribute('class', 'stars')

      // span (bullet)
      var bulletReviews = document.createElement("span")
      bulletReviews.innerHTML = "&bull;";
      bulletReviews.setAttribute('class', 'bullet')

      // number of reviews
      var numberOfReviews = document.createElement("span")
      numberOfReviews.setAttribute('class', 'number-of-reviews')

    // listing-price
    var listingPrice = document.createElement("span")
    listingPrice.setAttribute('class', 'listing-price')

    // bullet to go between price and cusine
    var bulletPriceCusine = document.createElement("span")
    bulletPriceCusine.innerHTML = "&bull;";
    bulletPriceCusine.setAttribute('class', 'bullet')

    // listing-cusine
    var listingCusine = document.createElement("span")
    listingCusine.setAttribute('class', 'listing-cusine')

    // 2. ARRANGE

      // // put image tag into avatar div
      listingAvatar.append(picture)

      // put divs into reviews div
      reviews.append(stars, bulletReviews, numberOfReviews)

      // put divs into the listing-info
      listingInfo.append(listingTitle, reviews, listingPrice, bulletPriceCusine, listingCusine)

      // put everything inside the listing div
      listing.append(listingAvatar, listingInfo)

      // put everything into the restaurants div
      var restaurantsDiv = document.getElementById('restaurants')
      restaurantsDiv.append(listing)


  // 3. INSERT DATA

  fetch('restaurants.json')
    .then(response => response.json())
    .then(data => {

  // create average of ratings
      // make average a global variable so it can be used as an argument in another function
      var average = 0;
      function makeAverage(indexOfRestaurant) {
          // save this particular rest. as a variable so that is it easier to refer to.
          var restaurant = data[indexOfRestaurant]
          // create count to use to calculate the average rating.
          var count = 0;
          for(var y = 0; y < restaurant.ratings.length; y++) {
          count += restaurant.ratings[y].stars
          }
          average = count / restaurant.ratings.length
      }

  // insert avatar
      picture.src = data[0].image

  // insert name
      listingTitle.innerHTML = data[0].restaurantName

  // review score
      makeAverage(0)
      createStars(average)

  // add number of reviews function Here
      numberOfReviews.innerHTML = data[0].ratings.length + " reviews"

  // add price range here
      listingPrice.innerHTML = data[0].priceRange

  // add cusine here
      listingCusine.innerHTML = data[0].cusine

    })  //END OF JSON FETCH

// helper functions:

function createStars(n) {
  for(var x = 0; x < Math.round(n); x++) {
    var actualStars = document.createElement("i")
    actualStars.setAttribute('class', 'fas fa-star')
    stars.append(actualStars)
  }
}
