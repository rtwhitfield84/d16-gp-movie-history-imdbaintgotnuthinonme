'use strict';

let signIn = require("./user");

$("#searchView").hide();

$("#signIn").click(signIn.logInGoogle);
$("#logOut").click(signIn.logOut);

// $("#auth-btn").click(function() {
//   console.log("clicked auth");
//   user.logInGoogle()
//   .then(function(result){
//     let user = result.user;
//     console.log('logged in user', user.uid);
//     $("#auth-btn").addClass('is-hidden');
//     $("#logout").removeClass('is-hidden');
//     loadSongsToDOM();
//   });
// });