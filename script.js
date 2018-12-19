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

          addMarker(pos, "green");

          infoWindow.setPosition(pos);

          var hanoi = {
            lat: 21.01906424814991,
            lng: 105.8671532571316
          }
          infoWindow.setPosition(hanoi);

          infoWindow.setContent('You are here');

          infoWindow.open(map);
          map.setCenter(pos);


          // EXAMPLE START
          var globalRestaurants;

          // add review average to a copy of json data
          function augmentRestaurantsData(restaurants) {
            // for each restaurant add new calculated info
            return restaurants.map((place) => ({
              ...place,
              // avarage rating is sum of all ratings / number of ratings
              averageRating: place.ratings.reduce(
                (total, curr) => curr.stars + total, 0) / place.ratings.length
            }))
          }

          // fake render
          function renderReviewList(restaurants) {
            // ...create listings here
          }

          // your star filter
          function filterByAvgStars(restaurants, min, max) {
            return restaurants.filter(place => {
              place.averageRating >= min &&
              place.averageRating <= max
            })
          }

          // new cleaner fetch
          function getRestaurants() {
            return fetch('restaurants.json')
              .then(response => response.json())
          }

          function onInit() {
            getRestaurants()  // fetch data
              .then(augmentRestaurantsData) // add averages to json data.
              .then(data => globalRestaurants = data) // add this data to a new variable.
              .then(renderReviewList); // create restaurant listings from this data.
          }

          function onAvgStarsChange(min, max) {
              if(!globalRestaurants) { //if globalRestaurants is empty
                getRestaurants() // fetch data
                  .then(augmentRestaurantsData) // add averages to json data.
                  .then(data => { // add this data to a new variable.
                    globalRestaurants = data;
                    return data;
                  })
                  .then(data => filterByAvgStars(data, min, max)) // filter the data
                  .then(renderReviewList); //  // create restaurant listings from this data.
              }
              var filtered = filterByAvgStars(globalRestaurants, min, max) //create filtered data
              renderReviewList(filtered); // render new list using this data
          }

          // EXAMPLE END



          // *** FETCH START ***
          fetch('restaurants.json')
            .then(response => response.json())
            .then(data => {

              /**
               * add meta data for each restaurant
               * PS not sure this codeworks i winged it :)
               */
              function augmentRestaurantsData(restaurants) {
                // for each restaurant add new calculated info
                return restaurants.map((place) => ({
                  // make a new array of all the restaurants
                  ...place,

                  // avarage rating is sum of all ratings / number of ratings
                  averageRating: place.ratings.reduce(
                    (total, curr) => curr.stars + total, 0) / place.ratings.length
                }))
              }
              // use this to render, maybe save it so you can use it later
              // without recalling the fetch?
              var dataWithAvgRatings = augmentRestaurantsData(data);




              // *** INSERT MODAL DATA ***

              function addModalData(restaurant) {
                // image
                    var modalImage = document.getElementById('m-img')
                    var steetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=254x254&location=${restaurant.lat},${restaurant.long}&fov=90&heading=235&pitch=10&key=AIzaSyAFAWdSJ9-ChPm_9XKsXG2aLGPDKc3aVfc`
                    modalImage.src = steetViewImg

                // name
                    var modalRestName = document.getElementById('m-rest-name')
                    modalRestName.innerHTML = restaurant.restaurantName

                // number of reviews
                    var modalNumberOfReviews = document.getElementById("m-number-of-reviews")
                    modalNumberOfReviews.innerHTML = restaurant.ratings.length + " reviews"

                // priceRange
                    var modalPriceRange = document.getElementById('m-price')
                    modalPriceRange.innerHTML = restaurant.priceRange

                // cusine
                    var modalCusine = document.getElementById('m-cusine')
                    modalCusine.innerHTML = restaurant.cusine

                // address
                    var modalAddress = document.getElementById('m-address')
                    modalAddress.innerHTML = restaurant.address


                // review stars

                    // make the average
                    var count = 0;
                    for(var y = 0; y < restaurant.ratings.length; y++) {
                    count += restaurant.ratings[y].stars
                    }
                    starAverage = count / restaurant.ratings.length


                    // clear existing stars
                    document.getElementById("m-stars").innerHTML = ""

                    // add the stars to the modal
                    for(var x = 0; x < Math.round(starAverage); x++) {
                      var modalStarsWrapper = document.getElementById("m-stars")
                      var actualStar = document.createElement("i")
                      actualStar.setAttribute('class', 'fas fa-star')
                      modalStarsWrapper.prepend(actualStar)
                    }

                // opening times
                  // *** ADD THIS FUNCTION WHEN YOU USE GOOGLE PLACES api ***

                function createReview(n) {

                  $('#m-reviews-container').empty();

                  for (var x = 0; x < n; x++) {
                    // 1. CREATE
                    var userReview = document.createElement("div")
                    userReview.setAttribute('class', 'row user-review')
                    var user = document.createElement("div")
                    user.setAttribute('class', 'user col-3')
                    var review = document.createElement("div")
                    review.setAttribute('class', 'review col-9')
                    var name = document.createElement("div")
                    name.setAttribute('class', 'name')
                    var starsWrapper = document.createElement("div")
                    starsWrapper.setAttribute('class', 'm-stars-wrapper stars')
                    var reviewComment = document.createElement("p")
                    reviewComment.setAttribute('class', 'review-comment')

                    // 2. ARRANGE
                    user.append(name)
                    userReview.append(user)
                    review.append(starsWrapper, reviewComment)
                    userReview.append(review)

                    var reviewsContainer = document.getElementById('m-reviews-container')
                    reviewsContainer.append(userReview)

                    // 3. INSERT

                    reviewComment.innerHTML = restaurant.ratings[x].comment

                    // stars
                    for (var y = 0; y < restaurant.ratings[x].stars; y++) {
                      var actualStars = document.createElement("i")
                      actualStars.setAttribute('class', 'fas fa-star')
                      starsWrapper.prepend(actualStars)
                    }
                  }
                }

                createReview(restaurant.ratings.length)

              }

              // CREATE LISTING

              // function createListing()

              data.forEach((x, i) => {

              var index = i + 1

              addMarker({lat: x.lat, lng: x.long}, "red", x, index)

                // 1. CREATE

                // make div
                var listing = document.createElement("div")
                listing.setAttribute('class', 'listing')

                listing.addEventListener('click', function() {
                  $("#myModal").modal()
                  addModalData(x)
                })

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
                  var reviewAverage = document.createElement("div")
                  reviewAverage.setAttribute('class', 'review-avg')

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

                  // infowindow
                  var restInfoWindow = document.createElement("div")
                      restInfoWindow.setAttribute('class', 'rest_info_window')


                  // 2. ARRANGE

                    // // put image tag into avatar div
                    listingAvatar.append(picture)

                    // put divs into reviews div
                    reviewAverage.append(stars, bulletReviews, numberOfReviews)

                    // put divs into the listing-info
                    listingInfo.append(listingTitle, reviewAverage, listingPrice, bulletPriceCusine, listingCusine)

                    // put everything inside the listing div
                    listing.append(listingAvatar, listingInfo)

                    // put everything into the restaurants div
                    var restaurantsDiv = document.getElementById('restaurants')
                    restaurantsDiv.append(listing)
                    // restInfoWindow.append(listing)


              // 3. INSERT DATA

            // create average of ratings
                // make average a global variable so it can be used as an argument in another function

                    // create count to use to calculate the average rating.
                    var count = 0;
                    for(var y = 0; y < x.ratings.length; y++) {
                    count += x.ratings[y].stars
                    }
                    x.average = count / x.ratings.length

            // insert avatar
                picture.src = x.image

            // insert name
                listingTitle.innerHTML = x.restaurantName
                listingTitle.prepend(`${index}. `)

            // review score
                // makeAverage()
                createStars(x.average, stars)

            // add number of reviews function Here
                numberOfReviews.innerHTML = x.ratings.length + " reviews"

            // add price range here
                listingPrice.innerHTML = x.priceRange

            // add cusine here
                listingCusine.innerHTML = x.cusine


            // helper functions:
                function createStars(n, id) {
                  for(var x = 0; x < Math.round(n); x++) {
                    var actualStars = document.createElement("i")
                    actualStars.setAttribute('class', 'fas fa-star')
                    id.prepend(actualStars)
                  }
                }

              }) // END OF LOOP

            })  //END OF JSON FETCH





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
        function addMarker(latLng, color, listing, listNumber) {

          if (listing !== undefined) {
            let url = "http://maps.google.com/mapfiles/ms/icons/";
            url += color + "-dot.png";

            let marker = new google.maps.Marker({
              map: map,
              position: latLng,
              icon: {
                url: url
              }
            });

            listNumber = listNumber ? `${listNumber}. ` : ""
            // console.log(listNumber)

            var restInfo = `
            <div class="listing">
              <div class="listing-avatar"><img src="${listing.image}"></div>
              <div class="listing-info infoWindow">
                <div class="listing-title">${listNumber}${listing.restaurantName}</div>
                <div class="listing-address">${listing.address}</div>
              </div>
            </div>
            `


            var infowindow = new google.maps.InfoWindow({
              content: restInfo
            });

            marker.addListener('mouseover', function() {
              infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function() {
              infowindow.close();
            });

            //store the marker object drawn in global array
            markersArray.push(marker);
          }


        }

// get city and country of location
        fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=21.01906424814991,%20105.8671532571316&key=AIzaSyAFAWdSJ9-ChPm_9XKsXG2aLGPDKc3aVfc')
          .then(response => response.json())
          .then(data => {
            var cityCountry = document.getElementById('city_and_country')
            cityCountry.innerHTML = data.results[5].formatted_address
          })
