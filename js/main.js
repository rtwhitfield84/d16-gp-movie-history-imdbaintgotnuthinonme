'use strict';

let signIn = require("./user");
let db = require('./db-interactions.js');

// dbInteractions.searchAll().then (function(data){
// 	(populateCards.createCards(data));
// 		if ( $('#unwatchedView').empty() ) {
// 			// loadUnwatched();
// 			$(unwatchedElements).hide();
// 		} else {
// 			console.log("poo");
// 		}
// });


// $(userElements).hide();

// $("#signin").click( () => {
// 	if ( $('#unwatchedView').empty() ) {
// 		signIn.logInGoogle();
// 		// loadUnwatched();
// 	} else {
// 		signIn.logInGoogle();
// 	}

// 	$("#signin").hide();
// 	$("#logout").show();

// });

// $("#logout").click(function(){
// 	signIn.logOut();
// 	$("#logout").hide();
// 	$("#signin").show();

// });



/*-- Search Button click--*/

$("#search").click( () => {
	db.searchAll($('#searchBar').val(), 'returnAll');
	});

// function searchDatabase() {
// 		if ($('#searchBar').val()) {
// 			signIn.getUser();
// 			if (signIn.getUser() === null) {
// 				console.log("Current User ID: ", signIn.getUser());
// 				let input = $("#searchBar").val();
// 				$("#mainView, #searchSpan").show();
// 				$(userElements).hide();
// 				untrackedResults.getUntracked(input).then(function(data){
// 					populateCards.createCards(data);
// 				});
// 			} else if (signIn.getUser() !== null) {
// 				console.log("Current User ID: ", signIn.getUser());
// 				let input = $("#searchBar").val();
// 				untrackedResults.getUntracked(input).then(function(data){
// 					populateCards.createCards(data);
// 					$(data.Search).each(function(i) {
// 						untrackedIds.push(data.Search[i].imdbID);
// 						checkIds();
// 					});
// 					showUntracked();
// 				console.log("Untracked IDs: ", untrackedIds);
// 				console.log("Unwatched IDs", unwatchedIds);
// 				});
// 			}
// 		} else {
// 			showUntracked();
// 			$('#untrackedView').html('No search criteria to fetch!');
// 		}
// }

// function checkIds() {
// 	$(unwatchedIds).each(function(i) {
// 		$(untrackedIds).each(function(j) {
// 			if (unwatchedIds[i] === untrackedIds[j]) {
// 				let matchedId = untrackedIds[j];
// 				// console.log("Match Found!", matchedId);
// 				let match = $("#untrackedView").find('#' + matchedId);
// 				console.log("MATCH", match);
// 				$(match).parent().remove();
// 			} else {
// 				console.log("No Matches Found");
// 			}
// 		});
// 	});
// }

/*-- Show Untracked click --*/
// $("#untracked").click(function() {
// 	if ($('#searchBar').val()) {
// 		searchDatabase();
// 		showUntracked();
// 		checkUnwatched();
// 	} else {
// 		showUntracked();
// 		checkUnwatched();
// 		$('#untrackedView').html('No search criteria to fetch!');
// 	}
// 	console.log("Untracked button clicked");

// });

// function checkUnwatched() {
// 	if ($('#unwatchedView').empty()) {
// 			// loadUnwatched();
// 			console.log("EMPTY OR NOT?");
// 		} else {
// 			console.log("Not empty");
// 		}
// }



// Show unwatched

// $("#unwatched").click(function(){
// 	console.log("before showUnwatched");
// 	showUnwatched();
// 	console.log("before checkIds");
// 	checkIds();
// 		console.log("before.click");
// 		$(document).click(function() {
// 			if ($(event.target).html() === 'Delete') {
// 				console.log("DELETE");
// 				let movieID = event.target.id;
// 				console.log("Delete movieID", movieID);
// 				dbInteractions.deleteMovies(movieID);
// 				event.target.parentNode.remove();
// 			}
// 		});
// 	let currentUser = signIn.getUser();

// });

// /*-- Show WATCHED click --*/
// $("#watched").click(function(){
//     console.log("watch clicked");
//     watched.getWatched().then(function(data){
//     	console.log("data", data);
//     	for (var prop in data) {
//     		see = Object.keys(data);
//     	}
//     	console.log("see", see);
//     });
//         // populateCards.watchedTemplate(data);
//         // showWatched();

// });

//rating functionality

// FUNCTIONS FOR TOGGLING VIEWS

// function showUntracked() {
// 	$(untrackedElements, '#searchSpan').show();
// 	$('#searchSpan').show();
// 	$(unwatchedElements, watchedElements, favoritesElements, '#mainView').hide();
// }

// function showUnwatched() {
// 	$('#mainView').hide();
// 	$(untrackedElements, watchedElements, favoritesElements).hide();
// 	$(unwatchedElements).show();
// }

// function showWatched() {
// 	$(watchedElements).show();
// 	$('#mainView').hide();
// 	$(untrackedElements, unwatchedElements, favoritesElements).hide();
// }

// function showFavorites() {
// 	$(favoritesElements, watchedElements).show();
// 	$(untrackedElements, unwatchedElements, '#mainView').hide();
// }

//accepts array of movie objects
function cardBuilder(movieArray) {

let initialRatings = [],
		cardHTML, 
		currentActors,
		currentDeleteButton, 
		stars, 
		addButton; 
//initial search does NOT show star ratings (unless rating !== null) or Actors

	movieArray.forEach(function(index, item){
		initialRatings.push(item.rating || null);

   if (item.Actors === undefined) {
      currentActors = '';
    } else {
      currentActors = `<p>Actors: ${item.Actors}</p>`;
    }


    if (index % 3 === 0) {
      cardHTML = `<div class="row">`;
    }
    //////////////////////////////////////////////
    //        Star rating variable
    //////////////////////////////////////////////

    //////////////////////////////////////////////
    //        Build Cards
    //////////////////////////////////////////////
    

     if (!item.uid) {
      currentDeleteButton = '';
      stars = '';
      addButton = `<a id="${item.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
    } else {
      addButton = '';
      currentDeleteButton = `<a data-delete-id="${item.id}" href="#" class="close deleteBtn ">x</a>`;
	    stars = `<select class="starRating">
	    						<option id="opt" value=""></option>
  								<option id="opt" value="1">1</option>
  								<option id="opt" value="2">2</option>
  								<option id="opt" value="3">3</option>
  								<option id="opt" value="4">4</option>
  								<option id="opt" value="5">5</option>
  								<option id="opt" value="6">6</option>
  								<option id="opt" value="7">7</option>
  								<option id="opt" value="8">8</option>
  								<option id="opt" value="9">9</option>
  								<option id="opt" value="10">10</option>
  							</select>`;
    }

    /*any poster address that contains ia or had a item of N/A returned no img so i replaced with ODB*/
    
    if (item.Poster.indexOf("ia") > -1 || item.Poster === "N/A") {
      item.Poster = 'https://thumbs.dreamstime.com/t/film-clapper-board-video-icon-30142238.jpg';
    }

		cardHTML += ` <div id='${item.imdbID}' class='col-offset-md-1 col-md-3'>
										<img class='poster' src='${item.Poster}'> 
											<p class='title'>${item.Title}</p>
											<p class='year'>${item.Year}</p>
											<p class='plot'>${item.Plot}</p>
											<label class='rate'>Rate This Movie</label>
											<button class='delete-btn' id='${item.id}'>Delete</button>
											<hr/>
											${stars}
										</div> `;
		

		if ((index + 1) % 3 === 0) {
      cardHTML += `</div>`;
    } else if (index === movieArray.length - 1) {
      cardHTML += `</div>`;
    }
    
    cardHTML = '';

		$("#mainView").append(cardHTML);

	});

	$('.starRating').each(function(index, item){
		$(item).barrating('show', {
	  	theme: 'bootstrap-stars',
	  	initialRating: initialRatings[index] || null,
	  	onSelect: function(value, text, event) {
	    
		    if (typeof(event) !== 'undefined') {
		      // rating was selected by a user
		      let parentEl = $(event.target).parents()[1];
		      parentEl.firstChild.setAttribute('value', value);
		      $(parentEl.firstChild).barrating('set', value);
		      //Targetting Delete Button for id of movie in firebase
		      let id = $(event.target).parents()[2].childNodes[11].id;
		      //Targeting select element for value 1-10 of rating
		      let ratingObj = {
		      	"rating": $(event.target).parents()[1].firstChild.getAttribute('value')
		      };
		      db.setRating(ratingObj, id);
		    } else {
		      // rating was selected programmatically
		    }
	  	}
		});
	});
}