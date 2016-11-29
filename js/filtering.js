"use strict";

let db = require("./db-interactions");

function returnUntracked(movies) {
	let untrackedMovies = $.grep(movies, (value, index) => {
		value.uid ? true : false;
	}, true);

	//send this to wherever the cards are built

}

function returnUnwatched(movies) {
	let unwatchedMovies = $.grep(movies, (value, index) => {
		return value.isWatched === false;
	});

	//send this to wherever the cards are built

}

function returnWatched(movies) {
	let watchedMovies = $.grep(movies, function(value, index) {
		return value.isWatched === true;
	});

	//send this to wherever the cards are built

}

function returnFavorites(movies, ratingThreshold) {

	let favoriteMovies = $.grep(movies, function(value, index) {
		return value.rating >= ratingThreshold;
	});
	
	//send this to wherever the cards are built


}



module.exports = {returnUntracked, returnUnwatched, returnWatched, returnFavorites};