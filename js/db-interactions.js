"use strict";

//function used to load movies onto DOM on splash page
function getMovies () {
	return new Promise( (resolve, reject) => {
		$.ajax({
			url: "http://www.omdbapi.com/?s=Batman&page=2"
		}).done(function(data) {
			resolve(data);
		}).fail( (error) => {
			reject(error);
		});
	});
}


//function used to pull movie info from OMDB before storing into Firebase
function saveMovies (movieId) {
	return new Promise((resolve, reject) =>{
		$.ajax({
			url: `http://www.omdbapi.com/?i=${movieId} `
		}).done(function(data){
			resolve(data);
		}).fail((error) =>{
			reject(error);
		});
	});
}

//function used to store movies into Firebase
function storeMovies(data, currentUser){
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies.json`,
			type: "POST",
			data: JSON.stringify(data)
		}).done();
	});
}

//function to get unwatched movies
function getUnwatchedMovies(currentUser) {
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies.json `
		}).done(function(data){
			resolve(data);
		});
	});
}

//function to delete movies from Firebase

function deleteMovies(movieID){
	return new Promise (function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies/${movieID}.json`,
			method: "DELETE",
		}).done(function(){
			resolve();
		});
	});
}

//function to set favorites with rating of 10

function setFavs(favDetails, movieToFav){
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies/${movieToFav}.json`,
			type: "PUT",
			data: JSON.stringify(favDetails)
		}).done(function(data){
			resolve(data);
		});
	});
}

//function to set watched movies

function setWatched(movieDetails, movieWatched){
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies/${movieWatched}.json`,
			type: "PUT",
			data: JSON.stringify(movieDetails)
		}).done(function(data){
			resolve(data);
		});
	});
}


module.exports = {getMovies, saveMovies, storeMovies, getUnwatchedMovies, deleteMovies, setFavs, setWatched};