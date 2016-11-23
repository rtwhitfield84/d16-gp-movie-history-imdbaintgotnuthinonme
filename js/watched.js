// "use strict";

// $("#watched").click(function(){
// 	getWatched().then(function(data){
// 		let watchedInfo = createCards(data);
// 		$("#watchedView").append(watchedInfo);	
// 	});
// });

// let currentUser = getUser();
// let userId = currentUser.uid;

// function getWatched(currentUser) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: ` https://imdb-group.firebaseio.com?uid=${userId }&watched='true' `	
// 		}).done(function(){
// 			resolve(data);
// 		});
// 	});
// }


// module.exports = getWatched;