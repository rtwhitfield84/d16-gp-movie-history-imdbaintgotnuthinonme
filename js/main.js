'use strict';

let signIn = require("./user");
let db = require('./db-interactions.js'),
	filter = require("./filtering.js");

// Event Listeners
$("#search").click( () => {
	console.log("search clicked");
	let myData = db.searchAll($('#searchBar').val(), 'returnAll')
	.then((myData)=>{
		console.log("promise time");
		// console.log("filter.getMovies()", filter.getMovies());
		console.log("myData", myData);
		cardBuilder(filter.returnAll(myData.Search));
		cardBuilder(filter.getMovies());
		// cardBuilder(filter[])
	});
});

//accepts array of movie objects
function cardBuilder(movieArray) {
	$("#mainView").html('');

	console.log("movieArray", movieArray);

let initialRatings = [],
		cardHTML, 
		currentActors,
		currentDeleteButton, 
		stars, 
		addButton; 

	movieArray.forEach(function(item, index){
		initialRatings.push(item.rating || null);
		console.log("index", index);

   if (item.Actors) {
      currentActors = `<p>Actors: ${item.Actors}</p>`;
    } else {
      currentActors = '';
    }


    if (index % 3 === 0) {
      cardHTML = `<div class="row">`;
    }
  
     if (!item.uid) {
      currentDeleteButton = '';
      stars = '';
      addButton = `<a id="${item.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
    } else {
      addButton = '';
      currentDeleteButton = `<a data-delete-id="${item.id}" href="#" class="close deleteBtn ">x</a>`;
	    stars = `<select class="starRating">
	    						<option id="opt" value=""></option>
  								<option id="opt" value="1">1</option>
  								<option id="opt" value="2">2</option>
  								<option id="opt" value="3">3</option>
  								<option id="opt" value="4">4</option>
  								<option id="opt" value="5">5</option>
  								<option id="opt" value="6">6</option>
  								<option id="opt" value="7">7</option>
  								<option id="opt" value="8">8</option>
  								<option id="opt" value="9">9</option>
  								<option id="opt" value="10">10</option>
  							</select>`;
    }

    /*any poster address that contains ia or had a item of N/A returned no img so i replaced with ODB*/  


    //POSTER stuff
    // if (item.Poster.indexOf("ia") > -1 || item.Poster === "N/A") {
    //   item.Poster = 'https://thumbs.dreamstime.com/t/film-clapper-board-video-icon-30142238.jpg';
    // }

		cardHTML += ` <div id='${item.imdbID}' class='col-offset-md-1 col-md-3'>
										<img class='poster' src='${item.Poster}'> 
											<p class='title'>${item.Title}</p>
											<p class='year'>${item.Year}</p>
											<p >${currentActors}</p>
											<label class='rate'>Rate This Movie</label>
											<button class='delete-btn' id='${item.id}'>Delete</button>
											<hr/>
											${stars}
										</div> `;
		
		if ((index + 1) % 3 === 0) {
      cardHTML += `</div>`;
    } else if (index === movieArray.length - 1) {
      cardHTML += `</div>`;
    }
    
	$("#mainView").append(cardHTML);
    cardHTML = '';


	});

	$('.starRating').each(function(index, item){
		$(item).barrating('show', {
	  	theme: 'bootstrap-stars',
	  	initialRating: initialRatings[index] || null,
	  	onSelect: function(value, text, event) {
	    
		    if (typeof(event) !== 'undefined') {
		      // rating was selected by a user
		      let parentEl = $(event.target).parents()[1];
		      parentEl.firstChild.setAttribute('value', value);
		      $(parentEl.firstChild).barrating('set', value);
		      //Targetting Delete Button for id of movie in firebase
		      let id = $(event.target).parents()[2].childNodes[11].id;
		      //Targeting select element for value 1-10 of rating
		      let ratingObj = {
		      	"rating": $(event.target).parents()[1].firstChild.getAttribute('value')
		      };
		      db.setRating(ratingObj, id);
		    } else {
		      // rating was selected programmatically
		    }
	  	}
		});
	});
}

