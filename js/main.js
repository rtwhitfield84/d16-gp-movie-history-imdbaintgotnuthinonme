'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let cardTemplate = require('../templates/onload.hbs');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');
let dbInteractions = require('./db-interactions.js');
let domBuilder = require ("./dom-builder");
let fb = require('./fb-interactions');
let uw = require('./unwatched');
let movieTemplate = require('../templates/movieTemplate.hbs');

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
                value.id = index;
                if (value.watched === false) {
                    let movieObj = {
                    	Title: value.Title,
                    	Poster: value.Poster,
                    	Year: value.Year,
                    	Plot: value.Plot,
                    	imdbID: value.imdbID,
                    	watched: value.watched,
                    	userRating: value.userRating,
                    	uid: value.uid
                    };
                let unwatchedMovieInfo = ` <div id='{{@ index}}' class='col-offset-md-1 col-md-3'>  <img class='poster' src='${movieObj.Poster}'>  <p class='title'>${movieObj.Title}</p>  <p class='year'>${movieObj.Year}</p>  <p class='plot'>${movieObj.Plot}</p>  <label id='rate'>Rate This Movie</label>  <select id='rating'>  <option value='1'>1</option>  <option value='2'>2</option>  <option value='3'>3</option>  <option value='4'>4</option>  <option value='5'>5</option>  <option value='6'>6</option>  <option value='7'>7</option>  <option value='8'>8</option>  <option value'9'>9</option>  <option value='10'>10</option> </select> <button class='delete-btn' id='${movieObj.imdbID}'>Delete</button>  </div> `;
                	console.log(movieObj);
                	$("#unwatchedView").append(unwatchedMovieInfo);
                }
                $(".delete-btn").click(function(e){
                	let movieID = this.id;
                	// console.log(this.id);
                	dbInteractions.deleteMovies(movieID);
                });
            });
		});
});