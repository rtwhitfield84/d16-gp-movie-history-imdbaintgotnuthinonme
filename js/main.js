'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');
let dbInteractions = require('./db-interactions.js');

dbInteractions.getMovies().then (function(data){
	(populateCards.createCards(data));
});

$("#unwatchedView").hide();
$("#watchedView").hide();
$("#favoritesView").hide();
$("#signin").click(signIn.logInGoogle);
$("#logout").click(signIn.logOut);

/*-- Search Button click--*/
$("#search").click(function(){
	let input = $("#searchBar").val();
	$("#mainView").show();
	untrackedResults.getUntracked(input).then(function(data){
		populateCards.createCards(data);
	});
});

/*-- Show Untracked click --*/
$("#untracked").click(function() {
	console.log("Untracked button clicked");
	$("#unwatchedView").hide();
	$("#watchedView").hide();
	$("#favoritesView").hide();
	$("#unwatchedSpan").hide();
	$("#watchedSpan").hide();
	$("#favoritesSpan").hide();
});
