"use strict"

/**
 * Filter an event based on whether or not its description includes
 * the specified value
 * 
 * @param {EngageEvent} event
 * @param {string} targetDescription
 */
export function filterByDesc(event, targetDescription) {
	return event.description.toLowerCase().includes(targetDescription.toLowerCase())
}

/**
 * Filter an event based on whether or not its start date matches
 * the specified value
 * 
 * @param {EngageEvent} event
 * @param {string} targetDate
 */
export function filterByDate(event, targetDate) {
	// console.log(event.start)
	const event_start_day = event.startDate.getFullYear()*384 + event.startDate.getMonth()*32 + event.startDate.getDate()
	const event_end_day = event.endDate.getFullYear()*384 + event.endDate.getMonth()*32 + event.endDate.getDate()
	const target_day = targetDate.getFullYear()*384 + targetDate.getMonth()*32 + targetDate.getDate()
	return event_start_day<= target_day && target_day <= event_end_day
}

/**
 * Filter an event based on whether or not its title includes
 * the specified value
 * 
 * @param {EngageEvent} event
 * @param {string} targetTitle
 */
export function filterByTitle(event, targetTitle) {
    return event.title.toLowerCase().includes(targetTitle.toLowerCase());
}


/**
 * Filter the list of events 
 * @param {EngageEvent[]} events
 * @param {string} value
 * @param {(event: EngageEvent, value: string) => boolean} filterFunction
 */
export function filterEvents(events, value, filterFunction) {
    return events.filter((event) => filterFunction(event, value))
}
