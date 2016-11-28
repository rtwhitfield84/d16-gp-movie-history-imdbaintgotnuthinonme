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
let watchedArr = [];
let userButtons = $('#untracked, #unwatched, #watched, #favorites');
let userElements = $('#unwatchedSpan, #watchedSpan, #favoritesSpan, #untrackedSpan');
let untrackedElements = $('#untrackedView, #untrackedSpan');
let unwatchedElements = $('#unwatchedView, #unwatchedSpan');
let watchedElements = $('#watchedView, #watchedSpan');
let favoritesElements = $('#favoritesView, #favoritesSpan');
let movieTemplate = require('../templates/movieTemplate.hbs');
let see;

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

	$("#signin").hide();
	$("#logout").show();

});

$("#logout").click(function(){
	signIn.logOut();
	$("#logout").hide();
	$("#signin").show();

});

let initialRatings = [];

function loadUnwatched() {
	let currentUser = signIn.getUser();
	dbInteractions.getUnwatchedMovies(currentUser).then(function(data){
			let returnedArray = $.map(data, function(value, index) {
				 var ids = Object.keys(data);
                ids.forEach(function(key, index){
                	data[key].id = key;
                });
                	if (value.rating !== undefined)
                		initialRatings.push(value.rating);
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
                	let unwatchedMovieInfo = ` <div id='${movieObj.imdbID}' class='col-offset-md-1 col-md-3'>
                															<img class='poster' src='${movieObj.Poster}'> 
                															<p class='title'>${movieObj.Title}</p>
                															<p class='year'>${movieObj.Year}</p>
                															<p class='plot'>${movieObj.Plot}</p>
                															<label class='rate'>Rate This Movie</label>
                																<button class='delete-btn' id='${movieObj.id}'>Delete</button>
                															<hr/>
                															<select class='rating'>
                																<option value='1'>1</option>
		                														<option value='2'>2</option>
		                														<option value='3'>3</option>
		                														<option value='4'>4</option>
		                														<option value='5'>5</option>
		                														<option value='6'>6</option>
		                														<option value='7'>7</option>
		                														<option value='8'>8</option>
		                														<option value='9'>9</option>
		                														<option value='10'>10</option
	                														</select> 
																						</div> `;
                	console.log(movieObj);
                	$("#unwatchedView").append(unwatchedMovieInfo);
							    
							    $('.rating').each(function(index, item){
                	console.log("initialRatings", initialRatings);
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
							            dbInteractions.setRating(ratingObj, id);
							          } else {
							            // rating was selected programmatically
							          }
							        }
							      });
							    });

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
	console.log("before showUnwatched");
	showUnwatched();
	console.log("before checkIds");
	checkIds();
		console.log("before.click");
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

});

/*-- Show WATCHED click --*/
$("#watched").click(function(){
    console.log("watch clicked");
    watched.getWatched().then(function(data){
    	console.log("data", data);
    	for (var prop in data) {
    		see = Object.keys(data);
    	}
    	console.log("see", see);
    });
        // populateCards.watchedTemplate(data);
        // showWatched();

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
	$('#mainView').hide();
	$(untrackedElements, unwatchedElements, favoritesElements).hide();
}

function showFavorites() {
	$(favoritesElements, watchedElements).show();
	$(untrackedElements, unwatchedElements, '#mainView').hide();
}