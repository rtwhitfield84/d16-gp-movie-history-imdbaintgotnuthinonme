'use strict';

let signIn = require("./user");


let Handlebars = require('hbsfy/runtime');
let moviesTemplate = require('../templates/movies.hbs');

Handlebars.registerPartial('navbar', require('../templates/partials/navbar.hbs'));

$("#searchView").hide();
$(".findNew--layout").hide();
$("#signIn").click(signIn.logInGoogle);
$("#logOut").click(signIn.logOut);


function populatePage(){
	let newDiv = document.createElement('div');
	newDiv.innerHTML = moviesTemplate();
	$("#navbar").append(newDiv);
	navActions();
}

///NAVBAR FUNCTIONALITY
function navActions() {
	$('a').click( () => {
		if ($(event.target).html() === 'Find new movies') {
			$('.findNew--layout').show();
			$('#searchView').hide();
			$('#headline').hide();
		} else if ($(event.target).html() === 'Search your movies') {
			console.log("Search your movies");
			$('#searchView').show();
			$('.findNew--layout').hide();
			$('#headline').hide();
		} else if ($(event.target).html() === 'Home') {
			console.log("Home");
			$('.findNew--layout').hide();
			$('#searchView').hide();
		}
	});
}

///FIND NEW MOVIE
$('#submitBtn-FN').click(findNew);

function findNew() {
	console.log('Title:', $('#newTitle').val(), 'Year:', $('#newYear').val());
}

///ADD TO WATCHLIST
$('#addWatch-FN').click( () => {
	console.log("Add to watchlist");
});

///USER MOVIE SEARCH
$('#sendSearch').click(userMovieSearch);

function userMovieSearch() {
	console.log("User Movie Title", $('#search').val());
}

populatePage();