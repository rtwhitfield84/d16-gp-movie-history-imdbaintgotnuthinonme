'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let cardTemplate = require('../templates/onload.hbs');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');
let dbInteractions = require('./db-interactions.js');
let domBuilder = require ("./dom-builder");
let fb = require('./fb-interactions');
let movieTemplate = require('../templates/movieTemplate.hbs');
let watched = require('./watched');

dbInteractions.getMovies().then (function(data){
	(populateCards.createCards(data));
});


$("#unwatchedView, #watchedView, #favoritesView").hide();
$("#signin").click(signIn.logInGoogle);
$("#logout").click(signIn.logOut);

/*-- Search Button click--*/
$("#search").click(function(){
	let input = $("#searchBar").val();
	$("#mainView, #searchSpan").show();
	$("#untracked, #unwatched, #watched, #favorites, #unwatchedSpan, #watchedSpan, #favoritesSpan").hide();
	untrackedResults.getUntracked(input).then(function(data){
		populateCards.createCards(data);
	});
});

/*-- Show Untracked click --*/
$("#untracked").click(function() {
	console.log("Untracked button clicked");
	$("#unwatchedView, #watchedView, #favoritesView, #unwatchedSpan, #watchedSpan, #favoritesSpan").hide();
});

// Show unwatched

$("#unwatched").click(function(){
	console.log("unwatched clicked");
	$("#unwatchedView").show();
	$("#mainView, #untrackedView, #searchSpan, #watchedView, favoritesView, #favoritesSpan, #watchedSpan").hide();
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
    			}
			}); 
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
});

/*-- Show WATCHED click --*/
$("#watched").click(function(){
	console.log("watch clicked");
    watched.getWatched().then(function(data){
        let watchedInfo = populateCards.createCards(data);
        $("#watchedView").append(watchedInfo);
    });
});

//rating functionality