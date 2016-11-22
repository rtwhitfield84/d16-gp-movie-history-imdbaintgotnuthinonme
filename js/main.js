'use strict';

let signIn = require("./user");
let Handlebars = require('hbsfy/runtime');
let cardTemplate = require('../templates/onload.hbs');

// let populateCards = require('./dom-builder.js');

// getMovies().then (function(data){
// 	(createCards(data));
// });

$("#searchView").hide();
$("#untrackedView").hide();
$("#favoritesView").hide();
$("#signin").click(signIn.logInGoogle);
$("#logout").click(signIn.logOut);


