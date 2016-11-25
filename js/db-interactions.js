"use strict";
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

function getUserMovies(currentUser){
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://imdb-group.firebaseapp.com/imdb-group/`
		}).done(function(data){
			resolve(data);
		}).fail((error) =>{
			reject(error);
		});
	});
}

function saveMovies (movieId) {
	return new Promise((resolve, reject) =>{
		$.ajax({
			url: ` http://www.omdbapi.com/?i=${movieId} `
		}).done(function(data){
			resolve(data);
		}).fail((error) =>{
			reject(error);
		});
	});
}

function storeMovies(data, currentUser){
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://imdb-group.firebaseio.com/imdb-group/movies.json`,
			type: "POST",
			data: JSON.stringify(data)
		}).done();
	});
}

function getUnwatchedMovies(currentUser) {
	return new Promise(function(resolve, reject){
		$.ajax({
			url: ` https://imdb-group.firebaseio.com/imdb-group/movies.json `	
		}).done(function(data){
			resolve(data);
		});
	});
}

function deleteMovies(movieID){
	return new Promise (function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/imdb-group/movies${movieID}.json`,
			method: "DELETE",
		}).done(function(){
			resolve();
		});
	});
}

module.exports = {getMovies, saveMovies, storeMovies, getUserMovies, getUnwatchedMovies, deleteMovies};