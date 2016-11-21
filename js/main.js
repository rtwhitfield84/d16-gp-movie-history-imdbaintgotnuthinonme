'use strict';

let signIn = require("./user");

let Handlebars = require('hbsfy/runtime');
let moviesTemplate = require('../templates/movies.hbs');

Handlebars.registerPartial('navbar', require('../templates/partials/navbar.hbs'));

$("#signIn").click(signIn.logInGoogle);



function populatePage(){
	let newDiv = document.createElement('div');
	newDiv.innerHTML = moviesTemplate();
	$("#navbar").append(newDiv);
}

populatePage();