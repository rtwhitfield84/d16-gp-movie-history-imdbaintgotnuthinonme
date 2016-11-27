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

dbInteractions.getMovies().then (function(data){
	(populateCards.createCards(data));
});


$("#unwatchedView, #watchedView, #favoritesView, #untrackedView").hide();

$("#signin").click( () => {
	signIn.logInGoogle();
	loadUnwatched();
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
		signIn.getUser();
		if (signIn.getUser() === null) {
			console.log("Current User ID: ", signIn.getUser());
			let input = $("#searchBar").val();
			$("#mainView, #searchSpan").show();
			$("#untracked, #unwatched, #watched, #favorites, #unwatchedSpan, #watchedSpan, #favoritesSpan").hide();
			untrackedResults.getUntracked(input).then(function(data){
				populateCards.createCards(data);
			});
		} else if (signIn.getUser() !== null) {
			console.log("Current User ID: ", signIn.getUser());
			let input = $("#searchBar").val();
			$("#mainView, #unwatchedView, #watchedView, #favoritesView, #unwatchedSpan, #watchedSpan, #favoritesSpan").hide();
			$("#untrackedView, #untrackedSpan, #searchSpan").show();
				untrackedResults.getUntracked(input).then(function(data){
				populateCards.createCards(data);
				$(data.Search).each(function(i) {
					untrackedIds.push(data.Search[i].imdbID);
				});
				console.log("Untracked IDs: ", untrackedIds);
				console.log("Unwatched IDs", unwatchedIds);

				$(unwatchedIds).each(function(i) {
					if (unwatchedIds[i] === untrackedIds) {
						console.log("Match Found", untrackedIds[i]);
					} else {
						console.log("No Matches Found");
						console.log("Untracked", untrackedIds[i]);
						console.log("Unwatched", unwatchedIds[i]);
					}
				});
		});


		}
	}

/*-- Show Untracked click --*/
$("#untracked").click(function() {
	if ($('#searchBar').val()) {
		searchDatabase();
	} else {
		$('#untrackedView').html('No search criteria to fetch!');
	}
	console.log("Untracked button clicked");
	$('#untrackedView, #untrackedSpan').show();
	$("#unwatchedView, #watchedView, #favoritesView, #unwatchedSpan, #watchedSpan, #favoritesSpan").hide();
});



// Show unwatched

$("#unwatched").click(function(){
	console.log("unwatched clicked");
	if ( $('#unwatchedView').empty() ) {
		loadUnwatched();
		$("#unwatchedView, #unwatchedSpan").show();
		$("#mainView, #untrackedView, #searchSpan, #watchedView, favoritesView, #favoritesSpan, #watchedSpan, #untrackedSpan").hide();
	} else {
		$("#unwatchedView, #unwatchedSpan").show();
		$("#mainView, #untrackedView, #searchSpan, #watchedView, favoritesView, #favoritesSpan, #watchedSpan, #untrackedSpan").hide();
	}
	let currentUser = signIn.getUser();
                $(".delete-btn").click(function(e){
                	let movieID = this.id;
                	dbInteractions.deleteMovies(movieID);
                	event.target.parentNode.remove();
                });
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
						dbInteractions.setWatched(movieWatched, movieDetails);
					} else if(userRating === "10"){
						let movieToFav = event.target.parentNode.childNodes[13].id;
						event.target.parentNode.remove();
						let favDetails = {
							Title: event.target.parentNode.childNodes[3].innerHTML,
							Poster: event.target.parentNode.childNodes[1].src,
							Year:event.target.parentNode.childNodes[5].innerHTML,
							Plot:event.target.parentNode.childNodes[7].innerHTML,
							uid: currentUser,
							imdbID:event.target.parentNode.id,
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
	$('#watchedView, #watchedSpan').show();
	$('#untrackedView, #untrackedSpan, #unwatchedView, #unwatchedSpan').hide();
    watched.getWatched().then(function(data){
        let watchedInfo = populateCards.createCards(data);
        $("#watchedView").append(watchedInfo);
    });
});

//rating functionality

