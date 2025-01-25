"use strict"

import {
	filterEvents,
	filterByTitle,
	filterByDesc,
	filterByDate,
} from "./filters.js"

import {parseEvents} from "./events.js";

let allEvents = [];
let displayCount = 25;
let currentWindowStart = 0;
let relavent = []
async function fetchAndSetEvents() {
    console.log("Events loading initiated.");
    // Wait for the events to be fetched and assign them to allEvents
    allEvents = await parseEvents();
	relavent = allEvents
	onPageLoad() // Replaced DOM load callback with defer in html
    console.log("Events Successfully loaded.");
}

fetchAndSetEvents()

// function to toggle the description of a certain card

function clearFilter() {
	document.querySelectorAll("div.filters > input").forEach((input) => {
		input.value = ""
	})
	currentWindowStart = 0
	relavent = allEvents
	refreshCards()
}

/**
 * Validate and read user input
 *
 * @param {SubmitEvent} event
 */
function onSubmit(event) {
	event.preventDefault()
	const formData = new FormData(event.target)
	// Filter and validate Date
	const date = formData.get("date")
	let currentFilter = allEvents
	if(date?.length > 0){
		const dateObj = Date.parse(date)
		if (Number.isNaN(dateObj)) {
			alert("Date entered is invalid!")
			console.log("invalid date")
		}else{
			currentFilter = filterEvents(allEvents,new Date(dateObj),filterByDate)
		}
	}
	// Filter by Title
	const title = formData.get("title")
	currentFilter = filterEvents(currentFilter, title, filterByTitle)
	// Filter by Description
	const description = formData.get("desc")
	currentFilter = filterEvents(currentFilter, description, filterByDesc)

	const countDropdown = document.getElementById("show").value
	if(countDropdown === "All"){
		displayCount = 999;
		console.log(displayCount)
	}else{
		displayCount = parseInt(countDropdown);
	}
	currentWindowStart = 0
	relavent = currentFilter
	refreshCards()
}

function refreshCards(){
	console.log(currentWindowStart)
	const eventsContainer = document.getElementById("events-list");
    eventsContainer.innerHTML = ""
	relavent.slice(currentWindowStart,currentWindowStart+displayCount).forEach(event => {
        eventsContainer.innerHTML += createCard(event);
    })
	document.querySelectorAll('.showing').forEach(element =>{
		element.innerHTML = `<h2> Showing: ${currentWindowStart+1} - ${Math.min(currentWindowStart+displayCount, relavent.length)} of ${relavent.length} / ${allEvents.length} events </h2>`;
	})
}

function onNext(){
	const maxLength = relavent.length
	const nextStart = currentWindowStart+displayCount
	if(nextStart>maxLength){
		return
	}
	currentWindowStart+= displayCount
	refreshCards()
}
function onPrev(){
	const nextStart = currentWindowStart-displayCount
	if(nextStart<0){
		return
	}
	currentWindowStart-= displayCount
	refreshCards()
}

function createCard(event){
	return `
            <li>
				<article class="card">
				<img class="picture" src="${event.image}">
				<h3 class="event-title"><b>${event.title}</b></h3>
				<p class="date">${event.startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
				<p class="location">${event.location}</p>
				<button class="learn-more" type="button">Learn More</button>
				<div class="description">${event.description}</div>
            	</article>
			</li>
        `;
}

function onPageLoad() {
                // adding event listeners for each learn more button (all cards)
				document.addEventListener('click', function (e) {
					if (e.target && e.target.classList.contains('learn-more')) {
						const card = e.target.closest('.card'); 
						const description = card.querySelector('.description'); 
						description.classList.toggle('shown');
						if (description.classList.contains('shown')) {
							e.target.textContent = 'Show Less';
						} else {
							e.target.textContent = 'Learn More';
						}
					}
				});
                const filterForm = document.querySelector("#filter > form")
                filterForm.addEventListener("reset", clearFilter)
                filterForm.addEventListener("submit", onSubmit)
				document.querySelectorAll('.prevButton').forEach(element => {
					element.addEventListener("click", onPrev)	
				})
				document.querySelectorAll('.nextButton').forEach(element => {
					element.addEventListener("click", onNext)	
				})
                refreshCards()
        
}

