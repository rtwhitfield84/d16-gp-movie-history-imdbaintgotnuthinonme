'use strict';

function getUntracked (input) {
	console.log("Untracked movies");
	return new Promise( (resolve, reject) => {
		$.ajax({
			url: `http://www.omdbapi.com/?s=${input}`
		}).done(function(data) {
			resolve(data);
		}).fail( (error) => {
			reject(error);
		});
	});
}

module.exports = {getUntracked};