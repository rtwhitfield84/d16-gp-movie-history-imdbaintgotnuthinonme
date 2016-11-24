'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let untrackedResults = require("./Untracked.js");
let populateCards = require('./dom-builder.js');
let dbInteractions = require('./db-interactions.js');

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

