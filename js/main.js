'use strict';

let signIn = require("./user");

<<<<<<< HEAD
let Handlebars = require('hbsfy/runtime');
let moviesTemplate = require('../templates/movies.hbs');

Handlebars.registerPartial('navbar', require('../templates/partials/navbar.hbs'));
=======
$("#searchView").hide();

$(".findNew--layout").hide();
>>>>>>> master

$("#signIn").click(signIn.logInGoogle);
$("#logOut").click(signIn.logOut);



function populatePage(){
	let newDiv = document.createElement('div');
	newDiv.innerHTML = moviesTemplate();
	$("#navbar").append(newDiv);
}

populatePage();