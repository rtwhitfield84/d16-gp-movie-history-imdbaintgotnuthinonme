"use strict";

let signIn = require("./user");

let currentUser = signIn.getUser();
// let userId = currentUser.uid;

function getWatched(currentUser) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: ` https://imdb-group.firebaseio.com/imdb-group/movies?uid='${currentUser}'&watched='true' `
        }).done(function(data){
            resolve(data);
        });
    });
}


module.exports = {getWatched};