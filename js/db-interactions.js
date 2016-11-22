"use strict";
function getMovies () {
	return new Promise( (resolve, reject) => {
		$.ajax({
			url: "http://www.omdbapi.com/?s=Batman&page=3"
		}).done(function(data) {
			resolve(data);
		}).fail( (error) => {
			reject(error);
		});
	});
}

module.exports = getMovies;