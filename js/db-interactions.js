"use strict";

let firebase = require("./firebaseConfig"),
	// cards = require("./movieCards.js"),
	filter = require("./filtering.js"),
	user = require("./user.js");

	var favoriteArray = [],
		notSoFavoriteArray = [];

  //////////////////////////////////////////////
    //        Open Search Function
    //////////////////////////////////////////////

function searchAll(title, filterCallback, rating) {
	let sumArray = [];
	console.log("filterCallback", filterCallback);
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?s="${title}"&y=&plot=short&r=json`
		}).done(function(movieData) {
			resolve(movieData);
			let currentUser = user.getUser();
			let OMDBArray = movieData.Search;
			let firebaseResults = new Promise((resolve, reject)=>{
				$.ajax({
					url: `https://imdb-group.firebaseio.com/movies.json?orderBy="uid"&equalTo="${currentUser}"`
				}).done((firebaseMovies)=>{
					resolve(firebaseMovies);

					let idArray = Object.keys(firebaseMovies); 
					idArray.forEach(function(key){
					  firebaseMovies[key].id = key;
					});

					let fbArray = $.map(firebaseMovies, function(value, index) {
					    return [value];
					});


					let filteredMovies = $.grep(fbArray, (value, index) => {
						return value.Title === title;
					});
					sumArray = sumArray.concat(filteredMovies);
					sumArray = sumArray.concat(OMDBArray);
					filter[filterCallback](sumArray, rating);
				});
			 });
    	});
	});
}


function searchID(ID) {
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?i=${ID}&plot=short&r=json`
		}).done(function(movieData) {
			resolve(movieData);
		});
	});
}

 //////////////////////////////////////////////
    //        Update User Movies/Check For Auth
    //////////////////////////////////////////////

function addToFirebase(movieObject) {
	movieObject.isWatched = false;
	movieObject.uid = user.getUser();
	if (movieObject.uid) {
		return new Promise((resolve,reject) => {
			$.ajax({
				url: 'https://moviehistory-f323f.firebaseio.com/movies.json',
				type: "POST",
				data: JSON.stringify(movieObject),
				dataType: 'json'
			});
		});
	} else {
		user.logInGoogle();
		 $("#signIn").addClass("hide");
		 $("#signOut").removeClass("hide");
	}
}

 //////////////////////////////////////////////
    //        Get Users Movies
    //////////////////////////////////////////////

function getMoviesFromFirebase(userID) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${userID}"`,
		}).done((userMovies) => {
			let returnedArray = $.map(userMovies, function(value, index) {
				value.id = index;
				if (value.isWatched === false && value.uid === userID) {
					    return [value];
					}
					});
			// cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}

 //////////////////////////////////////////////
    //        Remove From Users DB
    //////////////////////////////////////////////

function removeFromFirebase(deleteID) {
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies/${deleteID}.json`,
			method: "DELETE"
		}).done(()=>{
			resolve();
		});
	});
}

 //////////////////////////////////////////////
    //        Set Users Watched/Favorites
    //////////////////////////////////////////////

function setWatched(imdbID,rating) {
	let uid = user.getUser();
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${uid}"`,
		}).done((favorites) => {
			var watchedArray = $.map(favorites, function(value, index) {
				value.id = index;
				value.uid = user.getUser();
				value.isWatched = true;
				value.rating = rating;
					    return [value];
					});

			for (var i = 0; i < watchedArray.length; i++) {

			if (watchedArray[i].imdbID === imdbID) {
				if (watchedArray.rating < 10) {
					updateFirebase(watchedArray[i]);

				} else {
				
					updateFirebase(watchedArray[i]);
				}
			}
}
			resolve(favorites);
		});
	});
}

 //////////////////////////////////////////////
    //        Update User DB With New Props
    //////////////////////////////////////////////


function updateFirebase(watched) {
	let id = watched.id;
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies/${id}.json`,
			type: "PUT",
			data: JSON.stringify(watched),
			dataType: 'json'
		});
	});

}

 //////////////////////////////////////////////
    //       Load Users Not So Fav Flicks
    //////////////////////////////////////////////


function loadWatched(watched,uid) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${uid}"`,
		}).done((userMovies) => {
			let returnedArray = $.map(userMovies, function(value, index) {
				if( value.rating < 10) {
					    return [value];
					}
					});
			// cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}

 //////////////////////////////////////////////
    //       Load Users Fav Flicks
    //////////////////////////////////////////////

function loadFavorites(rating,uid) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="rating"&equalTo="${rating}"`,
		}).done((userMovies) => {
			console.log("userMovies", userMovies);
			let returnedArray = $.map(userMovies, function(value, index) {
				if (value.uid === uid && value.rating === "10") {
					    return [value];
				}
					});
			// cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}


function setRating(ratingObject, movieWatched){
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://imdb-group.firebaseio.com/movies/${movieWatched}.json`,
			type: "PATCH",
			data: JSON.stringify(ratingObject)
		}).done(function(data){
			resolve(data);
		});
	});
}




module.exports = {searchAll, searchID, addToFirebase, removeFromFirebase, getMoviesFromFirebase, setWatched, loadFavorites, loadWatched, setRating};














// 



/////// OLD LOGIC

// //function used to load movies onto DOM on splash page
// function getMovies () {
// 	return new Promise( (resolve, reject) => {
// 		$.ajax({
// 			url: "http://www.omdbapi.com/?s=Batman&page=2"
// 		}).done(function(data) {
// 			resolve(data);
// 		}).fail( (error) => {
// 			reject(error);
// 		});
// 	});
// }


// //function used to pull movie info from OMDB before storing into Firebase
// function saveMovies (movieId) {
// 	return new Promise((resolve, reject) =>{
// 		$.ajax({
// 			url: `http://www.omdbapi.com/?i=${movieId} `
// 		}).done(function(data){
// 			resolve(data);
// 		}).fail((error) =>{
// 			reject(error);
// 		});
// 	});
// }

// //function used to store movies into Firebase
// function storeMovies(data, currentUser){
// 	return new Promise((resolve, reject)=>{
// 		$.ajax({
// 			url: `https://imdb-group.firebaseio.com/movies.json`,
// 			type: "POST",
// 			data: JSON.stringify(data)
// 		}).done();
// 	});
// }

// //function to get unwatched movies
// function getUnwatchedMovies(currentUser) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://imdb-group.firebaseio.com/movies.json `
// 		}).done(function(data){
// 			resolve(data);
// 		});
// 	});
// }

// //function to delete movies from Firebase

// function deleteMovies(movieID){
// 	return new Promise (function(resolve, reject){
// 		$.ajax({
// 			url: `https://imdb-group.firebaseio.com/movies/${movieID}.json`,
// 			method: "DELETE",
// 		}).done(function(){
// 			resolve();
// 		});
// 	});
// }

// //function to set favorites with rating of 10

// function setFavs(favDetails, movieToFav){
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://imdb-group.firebaseio.com/movies/${movieToFav}.json`,
// 			type: "PUT",
// 			data: JSON.stringify(favDetails)
// 		}).done(function(data){
// 			resolve(data);
// 		});
// 	});
// }

// //function to set watched movies

// function setWatched(movieDetails, movieWatched){
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://imdb-group.firebaseio.com/movies/${movieWatched}.json`,
// 			type: "PUT",
// 			data: JSON.stringify(movieDetails)
// 		}).done(function(data){
// 			resolve(data);
// 		});
// 	});
// }

// module.exports = {getMovies, saveMovies, storeMovies, getUnwatchedMovies, deleteMovies, setFavs, setWatched, setRating};
