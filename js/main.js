'use strict';

let signIn = require("./user");


let Handlebars = require('hbsfy/runtime');
let moviesTemplate = require('../templates/movies.hbs');
let cardTemplate = require('../templates/onload.hbs');

Handlebars.registerPartial('navbar', require('../templates/partials/navbar.hbs'));
Handlebars.registerPartial('searchOptions', require('../templates/partials/breadcrumbs.hbs'));
Handlebars.registerHelper("rowHelper", function() {
	if (index % 3 === 0) {
		let newDiv = document.createElement("div");
		newDiv.addClass("row");
		$("#headline").append(newDiv);
	}
});

getMovies().then (function(data){
	(createCards(data));
});

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

function createCards (data) {
	console.log("create cards", data );
	let cardInfo = cardTemplate(data);
	$("#headline").html(cardInfo);
}

$("#searchView").hide();
$(".findNew--layout").hide();
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
		} else if ($(event.target).html() === "Sign in"){
			signIn.logInGoogle();
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