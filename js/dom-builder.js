"use strict";

function createCards (data) {
	console.log("create cards", data );
	let cardInfo = cardTemplate(data);
	$("#headline").html(cardInfo);
}

module.exports = createCards;