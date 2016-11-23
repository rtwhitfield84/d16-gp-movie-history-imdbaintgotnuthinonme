"use strict";

let cardTemplate = require('../templates/onload.hbs');

function createCards (data) {
	console.log("create cards", data );
	let cardInfo = cardTemplate(data);
	$("#mainView").html(cardInfo);
}

module.exports = {createCards};