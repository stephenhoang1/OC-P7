
var map, infoWindow;
var markersArray = [];

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

          // addMarker(pos, "green");

          infoWindow.setPosition(pos);

          var hanoi = {
            lat: 21.022151,
            lng: 105.835708
          }

          infoWindow.setPosition(hanoi);
          infoWindow.setContent('You are here');
          infoWindow.open(map);
          map.setCenter(hanoi);

          // service = new google.maps.places.PlacesService(map);
          // service.nearbySearch(request, callback);
          //
          //     var request = {
          //       location: hanoi,
          //       radius: '1000',
          //       type: ['restaurant']
          //     };
          //
          //     service = new google.maps.places.PlacesService(map);
          //     service.nearbySearch(request, callback);
          //
          //
          //   function callback(results, status) {
          //     if (status == google.maps.places.PlacesServiceStatus.OK) {
          //       console.log("places loaded")
          //       console.log(results)
          //     }
          //   }

          // make

          // google.maps.event.addListener(map, 'idle', function() {
          //   // get bounds
          //   var bounds =  map.getBounds();
          //   var ne = bounds.getNorthEast();
          //   var sw = bounds.getSouthWest();
          //   // console.log(ne)
          //
          // })






        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

      // EXECUTE GOOGLE PLACES API
      // service = new google.maps.places.PlacesService(map);
      // service.nearbySearch(request, callback);



      onInit()



      // create new rest array on changing of map
      google.maps.event.addListener(map, 'idle', function() {

        var tempRestArray = [];
        for (var i=0; i<globalRestaurants.length; i++) {
          // console.log('looping through globalRestaurants...')
          if( map.getBounds().contains({lat: globalRestaurants[i].lat, lng: globalRestaurants[i].long})) {
            tempRestArray.push(globalRestaurants[i])
          }
        }
        createListings(tempRestArray)
      });

      // RIGHT CLICK TO ADD A RESTAURANT

        // add marker on right click
        google.maps.event.addListener(map, "rightclick", function(event) {
          // placeMarker(event.latLng, map);
          // add current lat/long as a data attribute to the modal
          var addRestForm = document.getElementById("addRestForm")
          addRestForm.setAttribute('data-lat', event.latLng.lat())
          addRestForm.setAttribute('data-long', event.latLng.lng())
          // open addRestModal
          $('#addNewRestModal').modal('show')
        });

        function placeMarker(position, map) {
        var marker = new google.maps.Marker({
          position: position,
          map: map
        });
        map.panTo(position);
    }



  } //END OF INITMAP

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

    function createListings(restData) {

      // clear restauraunts from listings
      document.getElementById('restaurants').innerHTML = "";

      restData.forEach((x, i) => {

      var index = i + 1

      addMarker({lat: x.lat, lng: x.long}, "red", x, index)

        // 1. CREATE

        // make div
        var listing = document.createElement("div")
        listing.setAttribute('class', 'listing')

        // populate the selected modal's data when the listing is clicked
        listing.addEventListener('click', function() {
          $("#restModal").modal()
          addModalData(x)
        })

        // populate the selected addReview modal data when the button is clicked
        var addReviewButton = document.getElementById('review-button')
        addReviewButton.addEventListener('click', function() {
          $("#add-review-modal").modal()
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


    }

    function addModalData(restaurant) {
      // image
          var modalImage = document.getElementById('m-img')
          var streetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=254x254&location=${restaurant.lat},${restaurant.long}&fov=90&heading=235&pitch=10&key=AIzaSyAFAWdSJ9-ChPm_9XKsXG2aLGPDKc3aVfc`
          modalImage.src = streetViewImg

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

      // set setAttribute
          var restModal = document.getElementById('restModal')
          restModal.setAttribute('restaurant-name', restaurant.restaurantName)

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

        createReview(restaurant.ratings.length, restaurant)

    }

    function createReview(noOfReviews, restaurant) {

      $('#m-reviews-container').empty();

      for (var x = 0; x < noOfReviews; x++) {
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

    function addReviewModalData(restaurant) {

        var label = document.getElementById('addReviewLabel')
        label.innerHTML = restaurant.restaurantName
      }

    // your star filter
    function filterByAvgStars(restaurants, min, max) {
      return restaurants.filter(place => {
        return place.averageRating >= min &&
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
        .then(createListings); // create restaurant listings from this data.
    }

    function onAvgStarsChange(min, max) {
        if (!globalRestaurants) { //if globalRestaurants is empty.
           return getRestaurants() // fetch data
            .then(augmentRestaurantsData) // add averages to json data.
            .then(data => { // add this data to a new variable.
              globalRestaurants = data
              return data;
            })
            .then(data => filterByAvgStars(data, min, max)) // filter the data
            .then(createListings);  // create restaurant listings from this data.
        }
        // otherwise...
        else {
          var filtered = filterByAvgStars(globalRestaurants, min, max) //create filtered data
          createListings(filtered); // render new list using this data
        }
      }

    function filterOnSubmit() {
      var minVal = document.getElementById('min')
      var maxVal = document.getElementById('max')
      onAvgStarsChange(minVal.value, maxVal.value)
    }

    // *** FETCH START ***
    // fetch()
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data)
      // })  //END OF JSON FETCH



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

          // markersArray = [];



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

            // add number
            listNumber = listNumber ? `${listNumber}. ` : ""

            // add markup
            var restInfo = `
            <div class="listing">
              <div class="listing-avatar"><img src="${listing.image}"></div>
              <div class="listing-info infoWindow">
                <div class="listing-title">${listNumber}${listing.restaurantName}</div>
                <div class="listing-address">${listing.address}</div>
              </div>
            </div>
            `

            // add info to infowindow
            var infowindow = new google.maps.InfoWindow({
              content: restInfo
            });

            // add mouseover to event
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
//         fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=21.01906424814991,%20105.8671532571316&key=AIzaSyAFAWdSJ9-ChPm_9XKsXG2aLGPDKc3aVfc')
//           .then(response => response.json())
//           .then(data => {
//             var cityCountry = document.getElementById('city_and_country')
//             cityCountry.innerHTML = data.results[5].formatted_address
//           })

// handle data from add a review, and post it back to the reviews page

  document.addEventListener('DOMContentLoaded',function(){

    // ADD REVIEW

    document.getElementById('post-review').onclick=function(){

      // declare variables
      var commentData = document.getElementById('comment').value;
      var ratingData;
      var starRatings = document.getElementsByName('star-ratings')

      // loop through ratings radio buttons, see which one is checked.
      // Then get the value of that.
      for (var i = 0; i < starRatings.length; i++)
      {
        if (starRatings[i].checked)
        {
          ratingData = starRatings[i].value;
          break;
        }
      }

      // create new instance
      var newReview = {
        stars: parseInt(ratingData),
        comment: commentData
      }

      // get current rest modal and rest name from attributes
      var restModal = document.getElementById('restModal')
      var restName = restModal.getAttribute('restaurant-name')

      // loop through and find the restaurant object that matches restName
      for (var i=0; i < globalRestaurants.length; i++) {
        if (globalRestaurants[i].restaurantName === restName) {
          var currentRestaurant = globalRestaurants[i];
        }
    }

      // push that to the restaurant object
      currentRestaurant.ratings.push(newReview)

      // close up, and put form data back to default
      $('#restModal').modal('hide')

      createListings(globalRestaurants)
    }

    // ADD RESTAURANT



    // when the 'add restaurant' button is clicked...
    document.getElementById('post-restaurant').onclick=function(){

      // grab input data
      var nameData = document.getElementById('addName').value
      var addressData = document.getElementById('addAddress').value
      var priceRanges = document.getElementsByName('priceRanges')
      for (var y = 0; y < priceRanges.length; y++) {
        if (priceRanges[y].checked)
        {
          var priceRange = priceRanges[y].value;
          break;
        }
      }
      var cusineData = document.getElementById('addCusine').value
      var currentLat = document.getElementById('addRestForm').getAttribute('data-lat')
      var currentLong = document.getElementById('addRestForm').getAttribute('data-long')


      var newRestaurant = {
        restaurantName: nameData,
        image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/b7/d6/40/handmade-chips.jpg",
    		address: addressData,
    		cusine: cusineData,
    		priceRange: priceRange,
        lat:  parseFloat(currentLat),
        long: parseFloat(currentLong),
    		ratings: [

        ]
      }

      // push to the globalRestaurants array
      globalRestaurants.push(newRestaurant)

      // reset and hide form
      $('#addNewRestModal').modal('hide')
      document.getElementById('addRestForm').reset()

      // reload listings to see new object
      createListings(globalRestaurants)

      // call the newly created restaurant listing up so user can see what they have created
      var newListing = document.getElementById("restaurants").lastChild
      newListing.click()

    }

  })

// maybe add a function that refreshes the restaurant modal after adding a review.



// create UML disgrams showing one particular problem
