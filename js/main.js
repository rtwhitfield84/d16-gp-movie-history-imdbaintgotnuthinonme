'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let cardTemplate = require('../templates/onload.hbs');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');
let dbInteractions = require('./db-interactions.js');
let domBuilder = require ("./dom-builder");
let fb = require('./fb-interactions');
// let movieTemplate = require('../templates/movieTemplate.hbs');
let watched = require('./watched');
let unwatchedIds = [];
let untrackedIds = [];
let userButtons = $('#untracked, #unwatched, #watched, #favorites');
let userElements = $('#unwatchedSpan, #watchedSpan, #favoritesSpan, #untrackedSpan');
let untrackedElements = $('#untrackedView, #untrackedSpan');
let unwatchedElements = $('#unwatchedView, #unwatchedSpan');
let watchedElements = $('#watchedView, #watchedSpan');
let favoritesElements = $('#favoritesView, #favoritesSpan');

dbInteractions.getMovies().then (function(data){
	(populateCards.createCards(data));
		if ( $('#unwatchedView').empty() ) {
			loadUnwatched();
			$(unwatchedElements).hide();
		} else {
			console.log("poo");
		}
});


$(userElements).hide();

$("#signin").click( () => {
	if ( $('#unwatchedView').empty() ) {
		signIn.logInGoogle();
		loadUnwatched();
	} else {
		signIn.logInGoogle();
	}
});

$("#logout").click(signIn.logOut);

function loadUnwatched() {
	let currentUser = signIn.getUser();
	dbInteractions.getUnwatchedMovies(currentUser).then(function(data){
			let returnedArray = $.map(data, function(value, index) {
				 var ids = Object.keys(data);
                ids.forEach(function(key){
                	data[key].id = key;
                });
                if (value.watched === false) {
                    let movieObj = {
                    	Title: value.Title,
                    	Poster: value.Poster,
                    	Year: value.Year,
                    	Plot: value.Plot,
                    	imdbID: value.imdbID,
                    	watched: value.watched,
                    	userRating: value.userRating,
                    	uid: value.uid,
                    	id: value.id
                    };
                	let unwatchedMovieInfo = ` <div id='${movieObj.imdbID}' class='col-offset-md-1 col-md-3'>  <img class='poster' src='${movieObj.Poster}'>  <p class='title'>${movieObj.Title}</p>  <p class='year'>${movieObj.Year}</p>  <p class='plot'>${movieObj.Plot}</p>  <label class='rate'>Rate This Movie</label>  <select class='rating'>  <option value='1'>1</option>  <option value='2'>2</option>  <option value='3'>3</option>  <option value='4'>4</option>  <option value='5'>5</option>  <option value='6'>6</option>  <option value='7'>7</option>  <option value='8'>8</option>  <option value='9'>9</option>  <option value='10'>10</option> </select> <button class='delete-btn' id='${movieObj.id}'>Delete</button>  </div> `;
                	console.log(movieObj);
                	$("#unwatchedView").append(unwatchedMovieInfo);
					unwatchedIds.push(movieObj.imdbID);

    			}
			});
	});
}

/*-- Search Button click--*/
$("#search").click(searchDatabase);

function searchDatabase() {
		if ($('#searchBar').val()) {
			signIn.getUser();
			if (signIn.getUser() === null) {
				console.log("Current User ID: ", signIn.getUser());
				let input = $("#searchBar").val();
				$("#mainView, #searchSpan").show();
				$(userElements).hide();
				untrackedResults.getUntracked(input).then(function(data){
					populateCards.createCards(data);
				});
			} else if (signIn.getUser() !== null) {
				console.log("Current User ID: ", signIn.getUser());
				let input = $("#searchBar").val();
				untrackedResults.getUntracked(input).then(function(data){
					populateCards.createCards(data);
					$(data.Search).each(function(i) {
						untrackedIds.push(data.Search[i].imdbID);
						checkIds();
					});
					showUntracked();
				console.log("Untracked IDs: ", untrackedIds);
				console.log("Unwatched IDs", unwatchedIds);
				});
			}
		} else {
			showUntracked();
			$('#untrackedView').html('No search criteria to fetch!');
		}
}

function checkIds() {
	$(unwatchedIds).each(function(i) {
		$(untrackedIds).each(function(j) {
			if (unwatchedIds[i] === untrackedIds[j]) {
				let matchedId = untrackedIds[j];
				// console.log("Match Found!", matchedId);
				let match = $("#untrackedView").find('#' + matchedId);
				console.log("MATCH", match);
				$(match).parent().remove();
			} else {
				console.log("No Matches Found");
			}
		});
	});
}

/*-- Show Untracked click --*/
$("#untracked").click(function() {
	if ($('#searchBar').val()) {
		searchDatabase();
		showUntracked();
		checkUnwatched();
	} else {
		showUntracked();
		checkUnwatched();
		$('#untrackedView').html('No search criteria to fetch!');
	}
	console.log("Untracked button clicked");

});

function checkUnwatched() {
	if ($('#unwatchedView').empty()) {
			loadUnwatched();
			console.log("EMPTY OR NOT?");
		} else {
			console.log("Not empty");
		}
}



// Show unwatched

$("#unwatched").click(function(){
	console.log("unwatched clicked");
	showUnwatched();
	checkIds();
		$(document).click(function() {
			if ($(event.target).html() === 'Delete') {
				console.log("DELETE");
				let movieID = event.target.id;
				console.log("Delete movieID", movieID);
				dbInteractions.deleteMovies(movieID);
				event.target.parentNode.remove();
			}
		});
	let currentUser = signIn.getUser();
				$(".rating").change(function(){
					let userRating = $(this).val();
					if(userRating !== "10"){
						let movieWatched = event.target.parentNode.childNodes[13].id;
						event.target.parentNode.remove();
						let movieDetails = {
							Title: event.target.parentNode.childNodes[3].innerHTML,
							Poster: event.target.parentNode.childNodes[1].src,
							Year:event.target.parentNode.childNodes[5].innerHTML,
							Plot:event.target.parentNode.childNodes[7].innerHTML,
							uid: currentUser,
							imdbID:event.target.parentNode.id,
							watched: true,
							userRating: userRating
						};
						console.log(movieDetails);
						dbInteractions.setFavs(movieDetails, movieWatched);
					} else if(userRating === "10"){
						let movieToFav = event.target.parentNode.childNodes[13].id;
						console.log("movieToFav", movieToFav);
						event.target.parentNode.remove();
						let favDetails = {
							Title: event.target.parentNode.childNodes[3].innerHTML,
							Poster: event.target.parentNode.childNodes[1].src,
							Year: event.target.parentNode.childNodes[5].innerHTML,
							Plot: event.target.parentNode.childNodes[7].innerHTML,
							uid: currentUser,
							imdbID: event.target.parentNode.id,
							watched: true,
							userRating: 10
						};
						console.log(favDetails);
						dbInteractions.setFavs(favDetails, movieToFav);
					}

				});
});

/*-- Show WATCHED click --*/
$("#watched").click(function(){
	console.log("watch clicked");
	// $('#watchedView, #watchedSpan').show();
	// $('#untrackedView, #untrackedSpan, #unwatchedView, #unwatchedSpan').hide();
	showWatched();
    watched.getWatched().then(function(data){
    	console.log("data", data);
        let watchedInfo = populateCards.createCards(data);
        $("#watchedView").append(watchedInfo);
    });
});

//rating functionality

// FUNCTIONS FOR TOGGLING VIEWS

function showUntracked() {
	$(untrackedElements, '#searchSpan').show();
	$('#searchSpan').show();
	$(unwatchedElements, watchedElements, favoritesElements, '#mainView').hide();
}

function showUnwatched() {
	$('#mainView').hide();
	$(untrackedElements, watchedElements, favoritesElements).hide();
	$(unwatchedElements).show();
}

function showWatched() {
	$(watchedElements).show();
	$(untrackedElements, unwatchedElements, favoritesElements, '#mainView').hide();
}

function showFavorites() {
	$(favoritesElements, watchedElements).show();
	$(untrackedElements, unwatchedElements, '#mainView').hide();
}