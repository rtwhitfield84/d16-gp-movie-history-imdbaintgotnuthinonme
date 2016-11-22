'use strict';

let signIn = require("./user");


let Handlebars = require('hbsfy/runtime');
let cardTemplate = require('../templates/onload.hbs');

getMovies().then (function(data){
	(createCards(data));
});

$("#searchView").hide();
$("#untrackedView").hide();
$("#favoritesView").hide();
$("#logOut").click(signIn.logOut);

