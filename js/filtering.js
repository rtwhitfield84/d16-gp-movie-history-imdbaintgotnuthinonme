"use strict";

let db = require("./db-interactions"),
	moviesForCards = [];

function returnAll(movies) {
		console.log("movies", movies);
		//send movies to wherever the cards are built
		moviesForCards = movies;
		return movies;
}


function returnUntracked(movies) {
	let untrackedMovies = $.grep(movies, (value, index) => {
		if (value.uid) {
			return true;
		} else {
			return false;
		}
		// value.uid ? return true : return false;
	}, true);

	//send this to wherever the cards are built
		moviesForCards = untrackedMovies;
		return untrackedMovies;



}

function returnUnwatched(movies) {
	let unwatchedMovies = $.grep(movies, (value, index) => {
		return value.isWatched === false;
	});

	//send this to wherever the cards are built
		moviesForCards = unwatchedMovies;
		return unwatchedMovies;



}

function returnWatched(movies) {
	let watchedMovies = $.grep(movies, function(value, index) {
		return value.isWatched === true;
	});

	//send this to wherever the cards are built
		moviesForCards = watchedMovies;
		return watchedMovies;



}

function returnFavorites(movies, ratingThreshold) {

	let favoriteMovies = $.grep(movies, function(value, index) {
		return value.rating >= ratingThreshold;
	});
	
	//send this to wherever the cards are built
		moviesForCards = favoriteMovies;
		return favoriteMovies;

}


function getMovies() {
	console.log("moviesForCards", moviesForCards);
	return moviesForCards;
}





module.exports = {returnUntracked, returnUnwatched, returnWatched, returnFavorites, returnAll, getMovies};