'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');

// getMovies().then (function(data){
// 	(createCards(data));
// });

$("#searchView").hide();
$("#untrackedView").hide();
$("#favoritesView").hide();
$("#signin").click(signIn.logInGoogle);
$("#logout").click(signIn.logOut);

$("#search").click(function(){
	console.log("button clicked" );
	let input = $("#searchBar").val();
	untrackedResults.getUntracked(input).then(function(data){
		populateCards.createCards(data);
	});
});
