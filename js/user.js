"use strict";

let firebase = require("./firebaseConfig");
let provider = new firebase.auth.GoogleAuthProvider();
let currentUser = null;

firebase.auth().onAuthStateChanged(function(user){
	if(user){
		currentUser = user.uid;
		console.log('currentUser logged in?', currentUser);
		$("#untracked, #unwatched, #watched, #favorites, #unwatchedSpan, #watchedSpan, #favoritesSpan, #untrackedSpan").show();
		$("#unwatchedSpan, #watchedSpan, #favoritesSpan, #searchSpan").hide();
	} else {
		currentUser = null;
			$("#untracked, #unwatched, #watched, #favorites, #searchSpan, #unwatchedSpan, #watchedSpan, #favoritesSpan, #untrackedSpan").hide();
		console.log('currentUser logged out?', currentUser);
	}
});

function logInGoogle() {
	return firebase.auth().signInWithPopup(provider);
}

function logOut(){
	return firebase.auth().signOut();
}

function getUser(){
	return currentUser;
}

module.exports = {logInGoogle, logOut, getUser};