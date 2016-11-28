"use strict";

let signIn = require("./user");
let currentUser = signIn.getUser();
// let userId = currentUser.uid;

function getWatched(currentUser) {
	signIn.getUser();
	currentUser = signIn.getUser();
	console.log("currentUser", currentUser);
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://imdb-group.firebaseio.com/imdb-group/movies.json?orderBy="uid"&equalTo="${currentUser}"`
        }).done(function(data){
            resolve(data);
        });
    });
}


module.exports = {getWatched};